import { Injectable, EventEmitter } from '@angular/core';
import { PropertiesService as PropertiesApiService } from '@app/api_generated/api/properties.service'
import { BehaviorSubject } from 'rxjs';
import { Property, PropertyLocalData } from '../models/property.interface';
import { PropertyFormConfig } from '@app/helper/property-form-config';
import { HypothesisService as HypothesisApiService } from '@app/api_generated/api/hypothesis.service';
import { HypothesisInputLocal } from '../models/hypothesis.interface';
import { Hypothesis } from '@app/api_generated';
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { WatchlistDbService } from './watchlist.service';
import { LokijsService } from './lokijs.service';
import { Collection } from 'lokijs';
import { PromptChoice } from '../models/prompt-choice.interface';
import { PromptService } from '@app/shared/services/prompt.service';

@Injectable({
	providedIn: 'root'
})
export class PropertiesService {

	public isReady$ = new BehaviorSubject<boolean>(true)

	public properties: PropertyLocalData[] = []                 // pre-loaded list or properties
	public properties$: EventEmitter<any> = new EventEmitter()  // emit an event when there is a property change

	private dbHandler: Collection

	public addingWatchListData = new BehaviorSubject<boolean>(false) // emit when the adding form button is clicked on property add form

	constructor(
		private propertyApiService: PropertiesApiService,
		private hypothesisApiService: HypothesisApiService,
		private layoutService: LayoutService,
		private translate: TranslateService,
		private spinnerService: SpinnerService,
		private userSettingsMiddleware: UserSettingsMiddlewareService,
		private watchlistDbService: WatchlistDbService,
		private loki: LokijsService,
		private promptService: PromptService
	) {
		this.dbHandler = this.loki.db.addCollection('properties', {
			indices: ['propertyData.id', 'propertyData.parent', 'propertyData.inheritedFrom']
		})
	}

	// Get a property, document id is auto-generated
	getPropertyByDocId(docId: string): PropertyLocalData {
		try {
			return this.dbHandler.get(parseInt(docId))
		}
		catch (err) {
			return
		}
	}

	// Return list of all properties with no parents
	listProperties(): PropertyLocalData[] {
		return this.dbHandler.find({
			$or: [
				{ 'propertyData.parent': { $eq: null } },
				{ 'propertyData.parent': { $exists: false } }
			]
		}).filter((x) => x.hypothesisData && x.hypothesisData.output && x.propertyData) as PropertyLocalData[]
	}

	// Return list of all property and their models
	listPropertiesAndModels(): PropertyLocalData[] {
		return this.dbHandler.find({
			$and: [
				{ 'propertyData.id': { $exists: true } },
				{ 'hypothesisData.output': { $exists: true } },
			]
		})
	}

	deleteByPropertyId(propertyId: string) {
		const doc = this.getByPropertyId(propertyId)
		this.dbHandler.remove(doc.$loki)
	}

	async deleteModel(id: number): Promise<boolean> {
		const model = this.dbHandler.get(id)

		// User cannnot delete a master model
		if (!model.propertyData.parent) {
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' }
			]
			const translated = this.translate.instant('page.watchlist.property-model-list.cannotDeleteMaster')
			await this.promptService.prompt('', translated, promptChoices).toPromise()
			return false
		}

		const promptChoices: PromptChoice[] = [
			{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
			{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
		]
		const res = await this.promptService.prompt('', this.translate.instant('pages.property_model.delete'), promptChoices).toPromise()

		if (res === 'yes') {
			await this.deletePropertyByDocId(model.$loki)

			this.dbHandler.remove(id)

			this.layoutService.openSnackBar(this.translate.instant('page.watchlist.property-model-overview.remove'), null, 3000, 'info', false)

			// Sync the watchlist to retrieve the list of models in each property
			await this.watchlistDbService.sync()
			await this.watchlistDbService.changeModelsCount$.next(true)

			// As a new item has been removed, pull the latest user object to sync the usage
			await this.userSettingsMiddleware.sync()

			this.layoutService.openSnackBar(this.translate.instant('page.watchlist.property-model-overview.remove'), null, 3000, 'info', false)

			return true
		}
		else {
			return false
		}
	}

	async deletePropertyByDocId(docId: string): Promise<void> {
		try {
			const doc = this.getPropertyByDocId(docId)
			const propertyId = doc.propertyData.id
			this.dbHandler.remove(docId)
			await this.propertyApiService.deleteProperty(propertyId).toPromise()
			console.log(`Property ${propertyId} has been removed on API`)
		}
		catch (err) {
			// silent errors with 404 (already deleted on API but still present in the app)
			if (err && err.statusCode === 404) {
				return
			}
			else {
				throw err
			}
		}
	}

	getParentPropertiesInheritedFrom(id: string): PropertyLocalData[] {
		return this.dbHandler.find({
			'propertyData.inheritedFrom': id,
			'propertyData.parent': { $eq: null }
		})
	}

	// Get a property model, based on the id given from API
	getByPropertyId(id: string): PropertyLocalData {
		if (!id) {
			return
		}

		return this.dbHandler.findOne({
			'propertyData.id': id
		})
	}

	getMasterModel(propertyId: string): PropertyLocalData {
		if (!propertyId) {
			return
		}

		return this.dbHandler.findOne({
			'propertyData.inheritedFrom': propertyId,
			'propertyData.parent': { $eq: null }
		})
	}

	listChildModels(parentId: string = null): PropertyLocalData[] {
		return this.dbHandler.find({
			'propertyData.parent': parentId
		})
	}

	listInheritedProperties(id: string = null): PropertyLocalData[] {
		return this.dbHandler.find({
			'propertyData.inheritedFrom': id
		})
	}

	save(propertyData?: Property, hypothesisData?: Hypothesis): string {

		const propertyId = propertyData && propertyData.id ||
			hypothesisData && hypothesisData.input && hypothesisData.input.propertyId

		try {

			if (hypothesisData && hypothesisData.input) {
				(hypothesisData.input as any)._id = (hypothesisData as any)._id
			}

			const doc = this.getByPropertyId(propertyId)
			if (doc) {
				doc.propertyData = { ...doc.propertyData, ...propertyData }
				doc.hypothesisData = { ...doc.hypothesisData, ...hypothesisData }
				this.updateProperty(doc)
			}
			else {
				this.addProperty(propertyData, hypothesisData)
			}
		}
		catch (err) {
			const msg = `[save] Error: ${err}`
			console.error(msg)
			throw err
		}

		return propertyId

	}

	// Create a property model, document id auto-generated
	addProperty(propertyData, hypothesisData?) {

		const saveData: PropertyLocalData = {
			propertyData,
			hypothesisData,
			localUpdateTime: +new Date()
		}
		if (!hypothesisData) {
			delete saveData.hypothesisData
		}
		if (!propertyData) {
			delete saveData.propertyData
		}

		this.dbHandler.insert(saveData)
		console.log(`Property has been added locally`)
	}

	updateProperty(doc: PropertyLocalData) {
		this.dbHandler.update(doc)
	}

	// save the property locally, then save to API, then perform calculations on API, then save the result
	async saveFormData(formData: PropertyFormConfig): Promise<any> {
		this.spinnerService.text = this.translate.instant('spinner.calculatingFinancials')
		this.spinnerService.show()

		const formConfig: PropertyFormConfig = new PropertyFormConfig(formData)
		const { property, hypothesis } = formConfig.getData()

		const docId = await this.saveProperty(property, hypothesis)
		const propertyDoc = this.getPropertyByDocId(docId)

		const watchlists = this.watchlistDbService.list()
		const watchlist = watchlists.slice(-1)[0]

		// Create a property from an existing MREX property (inherited from MREX property)
		if (propertyDoc.propertyData.inheritedFrom) {
			await this.watchlistDbService.addProperty(watchlist, propertyDoc.propertyData.inheritedFrom)
		}
		// User created property; No property at this address exist in MREX DB
		else if (!propertyDoc.propertyData.parent) {
			await this.watchlistDbService.addProperty(watchlist, propertyDoc.propertyData.id)
		}

		await Promise.all([
			// As a new item has been added, pull the latest user object to sync the usage
			await this.userSettingsMiddleware.sync(),

			// Sync the watchlist to retrieve the list of models in each property
			this.watchlistDbService.sync().then(() => {
				this.watchlistDbService.changeModelsCount$.next(true)
			})
		])

		return propertyDoc

	}

	async saveProperty(property: Property, hypothesis: HypothesisInputLocal): Promise<string> {

		const operation = property.id ? 'update' : 'insert'

		let docId, propertyApiData

		try {
			if (operation === 'insert') {
				propertyApiData = await this.propertyApiService.addProperty(property).toPromise()
				console.log('Property has been added to API', propertyApiData)
			}
			else {
				propertyApiData = await this.propertyApiService.updateProperty(property, property.id || '').toPromise()
				console.log('Property has been updated on API', propertyApiData)
			}

			// ------------- save to local DB ------------------
			const propertyId = this.save(propertyApiData)

			// Retrieve the property
			const doc = this.getByPropertyId(propertyId)

			docId = doc.$loki
			hypothesis.propertyId = doc.propertyData.id

			// do nothing if nothing changed
			if (doc.hypothesisData
				&& hypothesis
				&& JSON.stringify(hypothesis) === JSON.stringify(doc.hypothesisData.input)) {
				console.log('Hypothesis has not change, do nothing!')
				return
			}

			// send hypothesis to API
			if (hypothesis._id) {
				const res = await this.hypothesisApiService.updateHypothesis(hypothesis, hypothesis._id).toPromise()
				console.log(`Hypothesis ${hypothesis._id} has been updated on API`)
				this.save(null, res)
			}
			else {
				console.log('Sent hypothesis to API...')
				const res: any = await this.hypothesisApiService.addHypothesis(hypothesis, true).toPromise()
				console.log(`Hypothesis ${res._id} has been created on API`)
				this.save(null, res)
			}
		}
		catch (err) {
			console.error(err)
			if (docId && operation === 'insert') {
				await this.deletePropertyByDocId(docId).catch()
			}
			this.spinnerService.hide()
			this.layoutService.openSnackBar(this.translate.instant('service.properties.errorCalc', {
				requestId: err.error.requestId
			}), null, 5000, 'error')
			throw new Error(`Failed to save to server: ${err && err.message}`)
		}

		this.properties$.emit('change')

		return docId

	}

}

export interface PropertyAddInput {
	propertyData?: Property | undefined | null
	hypothesisData?: any | undefined | null
}
