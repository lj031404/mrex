import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, take, takeWhile } from 'rxjs/operators'
import { ModalRef } from '@app-models/modal-ref'
import { Property, PropertyLocalData } from '@app-models/property.interface'
import { LayoutService } from '@app/layout/service/layout.service'
import { PropertiesService } from '@app/core/localDB/properties.service'
import { PropertyAddComponent } from '@app/helper/property-add/property-add.component'
import { PropertyFormConfigAdapter } from '@app/helper/adapters/property-form-config.adapter'
import { SpinnerService } from '@app/shared/services/spinner.service';
import { _translate } from '@app/core/utils/translate.util';
import { TranslateService } from '@ngx-translate/core';
import { PlansService } from '@app/shared/services/plans.service';
import { PromptService } from '@app/shared/services/prompt.service';
import { PromptChoice } from '@app/core/models/prompt-choice.interface';
import { RouterMap } from '@app/core/utils/router-map.util';
import * as _ from 'lodash';
import { MarketService } from '@app/api_generated';

@Component({
	selector: 'app-property-models-list',
	templateUrl: './property-models-list.component.html',
	styleUrls: ['./property-models-list.component.scss']
})
export class PropertyModelsListComponent implements OnInit, OnDestroy {

	models: PropertyLocalData[]
	propertyId: string
	property: Property

	masterModel: PropertyLocalData

	subscription = true

	isLoading = false
	modelFormComplete = new EventEmitter<any>()
	modalRef: ModalRef
	emptyModels = ['', '', '', '', '', '', '']
	constructor(
		private propertiesService: PropertiesService,
		private layoutService: LayoutService,
		private formConfigAdapter: PropertyFormConfigAdapter,
		private router: Router,
		private route: ActivatedRoute,
		private translate: TranslateService,
		private plansService: PlansService,
		private promptService: PromptService,
		private spinnerService: SpinnerService,
		private marketService: MarketService
	) {
		router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			filter((event: NavigationEnd) => event.url.includes(RouterMap.Watchlist.MODELING)),
		).subscribe(() => {
			this.clear()
			this.onRouteChange()
		})
	}

	clear() {
		this.models = []
	}

	async onRouteChange() {
		this.propertyId = this.route.snapshot.paramMap.get('id')

		// Check if the property is a user property
		const userProperty = this.propertiesService.getByPropertyId(this.propertyId)
		if (userProperty) {
			this.property = userProperty.propertyData
			this.masterModel = this.propertiesService.getMasterModel(this.property.inheritedFrom)
		}
		// the property is a MREX property
		else {
			this.property = await this.marketService.getMarketProperty(this.propertyId).toPromise()
			this.masterModel = this.propertiesService.getMasterModel(this.property.id)
		}

		this.loadModels()

		// Listen for changes in properties
		this.propertiesService
			.properties$
			.pipe(
				takeWhile(() => Boolean(this.modalRef))
			).subscribe(res => {
				this.loadModels()
			})
	}

	async ngOnInit() {
		this.subscribeFormComplete()
	}

	subscribeFormComplete() {
		this.modelFormComplete.subscribe(async (formData) => {
			try {
				console.log('Property form complete', formData)

				formData.property.parent = this.masterModel.propertyData.id || null
				const property = await this.propertiesService.saveFormData(formData)

				this.loadModels()
				this.propertiesService.addingWatchListData.next(false)

				await this.router.navigate([ RouterMap.Watchlist.url([ this.propertyId, RouterMap.Watchlist.MODELING, property.propertyData.id ])])

				this.spinnerService.hide()
				this.modalRef.closeModal()
			}
			catch (err) {
				console.error(err)
				this.spinnerService.hide()
				this.propertiesService.addingWatchListData.next(false)
			}
		})
	}

	onModelClicked(model: PropertyLocalData) {
		// check if the model exist
		if (model.hypothesisData && model.propertyData) {
			const queryParams = { redirect: this.router.url }
			this.router.navigate([ model.propertyData.id ], { relativeTo: this.route, queryParams, replaceUrl: true })
		}
		else {
			this.layoutService.openSnackBar(_translate(this.translate.instant('page.watchlist.property-model-list.errorOpen')), null, 5000, 'error')
		}
	}

	async loadModels() {
		this.isLoading = true
		this.models = this.propertiesService.listInheritedProperties(this.property.inheritedFrom || this.propertyId)
		if (this.models.length === 0) {
			// User created property not inherited from MREX
			const userProperty = this.propertiesService.getByPropertyId(this.propertyId)
			this.models = [ userProperty, ...this.propertiesService.listChildModels(this.property.id) ]
		}
		this.models = this.models.sort((a, b) => new Date(a.propertyData.createdAt).getTime() - new Date(b.propertyData.createdAt).getTime())
		this.isLoading = false
	}

	async addModel() {
		if (this.masterModel) {
			const config = this.formConfigAdapter.adapt(this.masterModel.propertyData, this.masterModel.hypothesisData)
			const modelCount = this.models.length
			config.property.name = _translate(this.translate.instant('page.watchlist.property-model-list.newModel')) + ` (${modelCount})`
			config.property.parent = config.property.id
			delete config.property.id
			delete config.property.hypothesisId

			// Open the drawer if the usage is under the limit
			const propertyId = this.masterModel.propertyData.id
			const { upgradeRequired, requiredPlan, currentPlan } = await this.plansService.minimumRequiredPlan('modeling_per_property', propertyId)

			if (upgradeRequired) {
				const planName    = this.translate.instant(`plans.${currentPlan}`)
				const newPlanName = this.translate.instant(`plans.${requiredPlan}`)
				const promptChoices: PromptChoice[] = [
					{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
					{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
				]
				const translated = this.translate.instant('billing.prompt.limitReached.models', { planName, newPlanName })
				this.promptService.prompt('', translated, promptChoices)
					.pipe(take(1))
					.subscribe(async (res) => {
						if (res === 'yes') {
							const redirect = this.router.url
							this.router.navigate([ RouterMap.Subscription.path ], { queryParams: { plan: requiredPlan, redirect } })
						}
					})
			}
			else {
				this.modalRef = this.layoutService.openModal(PropertyAddComponent, {
					config,
					complete: this.modelFormComplete
				}, false)
			}
		}
	}

	ngOnDestroy() {
		this.subscription = false
	}

	async back(): Promise<boolean> {
		const propertyDocId = this.route.snapshot.paramMap.get('id')
		return this.router.navigate([ RouterMap.Watchlist.url([ propertyDocId, RouterMap.Watchlist.ACTIVITY ]) ])
	}

	async onDelete(model: PropertyLocalData): Promise<void> {
		const success = await this.propertiesService.deleteModel(model.$loki)
		if (success) {
			this.models = this.models.filter(m => m.propertyData.id !== model.propertyData.id)
		}
	}
}
