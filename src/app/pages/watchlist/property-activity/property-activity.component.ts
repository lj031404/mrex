import { Component, OnInit, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PropertyHeader, PropertyLocalData } from '@app/core/models/property.interface';
import { UnitType } from '@app/core/models/unit.enum';
import { ListingActivityFeed, ListingActivityFeedIconEnum } from '@app/core/models/listing-item.interface';
import { TranslateService } from '@ngx-translate/core';
import { PropertiesService } from '@app/core/localDB/properties.service'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Address, WatchlistProperty } from '@app/api_generated';
import { RouterMap } from '@app/core/utils/router-map.util';
import { DateLangPipe } from '@app/shared/pipes/date-lang.pipe'
import { PropertyFormConfigAdapter } from '@app/helper/adapters/property-form-config.adapter';
import { PropertyAddComponent } from '@app/helper/property-add/property-add.component';
import { ModalRef } from '@app/core/models/modal-ref';
import { LayoutService } from '@app/layout/service/layout.service';
import { Property } from '@app-models/property.interface'
import { _translate } from '@app/core/utils/translate.util';
import { PlansService } from '@app/shared/services/plans.service';
import { PromptChoice } from '@app/core/models/prompt-choice.interface';
import { PromptService } from '@app/shared/services/prompt.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { CalculatorService } from '@app/shared/services/calculator.service';
import { WatchlistDbService } from '@app/core/localDB/watchlist.service';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-property-activity',
	templateUrl: './property-activity.component.html',
	styleUrls: ['./property-activity.component.scss'],
	providers: [DateLangPipe],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyActivityComponent implements OnInit {

	propertyId: string
	rootProperty: WatchlistProperty

	masterModelDoc: PropertyLocalData
	models: PropertyLocalData[] = []

	public header: PropertyHeader
	public header$: BehaviorSubject<PropertyHeader> = new BehaviorSubject({
		pictures: [],
		marketValue: {
			value: null,			            // todo: API should return last sale price
			unit: UnitType.CAD,					// todo: API should return currency
		},
		listingType: undefined
	})
	address: Address
	addressStr: string
	city: string

	feed: ListingActivityFeed[] = []
	feed$: BehaviorSubject<ListingActivityFeed[]> = new BehaviorSubject([])
	addedDate: Date

	modalComplete = new EventEmitter<any>()

	modalRef: ModalRef
	emptyFeeds = ['', '', '']
	constructor(
		private translate: TranslateService,
		private route: ActivatedRoute,
		private propertiesService: PropertiesService,
		private watchlistDbService: WatchlistDbService,
		private dateLangPipe: DateLangPipe,
		private router: Router,
		private formConfigAdapter: PropertyFormConfigAdapter,
		private layoutService: LayoutService,
		private plansService: PlansService,
		private promptService: PromptService,
		private spinnerService: SpinnerService,
		private calculatorService: CalculatorService,
		private changeDetectorRef: ChangeDetectorRef
	) {
		router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			filter((event: NavigationEnd) => event.url.includes(RouterMap.Watchlist.ACTIVITY)),
		).subscribe(() => {
			this.changeDetectorRef.markForCheck()
			this.clear()
			this.onRouteChange()
		})
		this.header$ = new BehaviorSubject<PropertyHeader>(this.header)
	}

	async onRouteChange() {
		this.propertyId = this.route.snapshot.paramMap.get('id')

		const watchlist = this.watchlistDbService.getCurrent()
		this.rootProperty = watchlist.properties.find(x => x.id === this.propertyId)

		if (!this.rootProperty) {
			this.router.navigate([ RouterMap.Watchlist.path ])
			return
		}

		this.addedDate = this.rootProperty.createdAt
		this.addressStr = this.setAddressStr(this.rootProperty.address)
		this.city = this.rootProperty.address.city

		this.setHeader(this.rootProperty)

		// get master model associated to this property
		try {
			this.masterModelDoc = this.propertiesService.getMasterModel(this.rootProperty.inheritedFrom || this.propertyId)
			if (!this.masterModelDoc) {
				this.masterModelDoc = this.propertiesService.getByPropertyId(this.propertyId)
			}
			if (this.masterModelDoc) {
				this.models = this.propertiesService.listChildModels(this.masterModelDoc.propertyData.id)
			}
			this.setFeed()
		}
		catch (err) {
			console.error(err)
		}

		this.changeDetectorRef.detectChanges()
	}

	async ngOnInit() {
		this.subscribeFormComplete()
	}

	async clear() {
		this.feed$.next([])
		this.clearHeader()
		this.addedDate = undefined
		this.addressStr = ''
		this.changeDetectorRef.detectChanges()
		this.models = []
	}

	async subscribeFormComplete() {
		// Ref: https://blog.angular-university.io/rxjs-error-handling/
		// Save to API, then PouchDB. If it fails to save to API, then just save a the property object to PouchDB with the _id "temp_"
		this.modalComplete.subscribe(async (formData) => {
			try {
				formData.property.parent = this.masterModelDoc && this.masterModelDoc.propertyData.id || null

				const property = await this.propertiesService.saveFormData(formData)

				this.masterModelDoc = await this.calculatorService.getMasterModel(this.propertyId)
				this.setFeed()

				const redirect = this.router.url
				const queryParams = { redirect }
				await this.router.navigate([RouterMap.Watchlist.url([this.propertyId, RouterMap.Watchlist.MODELING, property.propertyData.id])], { queryParams })

				this.propertiesService.addingWatchListData.next(false)
				this.spinnerService.hide()
				this.modalRef.closeModal()
				this.changeDetectorRef.markForCheck()
			}
			catch (err) {
				console.error(err)
				this.spinnerService.hide()
				this.propertiesService.addingWatchListData.next(false)
				this.changeDetectorRef.markForCheck()
			}
		})

	}

	setFeed() {
		let feed = []

		// models feed items
		this.models.forEach(model => {
			const name = model.propertyData.name
			const modelCreatedDate: ListingActivityFeed = {
				icon: ListingActivityFeedIconEnum.Calculator,
				text: this.translate.instant('page.watchlist.property-activity.feed.price.modelAddedDate', { name }),
				feedDate: new Date(model.propertyData.createdAt).getTime(),
				linkLabel: this.translate.instant('shared.components.ListingActivityFeed.viewModel'),
				linkUrl: RouterMap.Watchlist.url([this.rootProperty.id, RouterMap.Watchlist.MODELING, model.propertyData.id]),
				redirect: this.router.url,
			}
			feed.push(modelCreatedDate)
		})

		if (this.masterModelDoc) {
			// master model feed item
			const masterModelFeedItem: ListingActivityFeed = {
				icon: ListingActivityFeedIconEnum.Calculator,
				text: this.translate.instant('page.watchlist.property-activity.feed.price.masterModelAddedDate'),
				feedDate: new Date(this.masterModelDoc.propertyData.createdAt).getTime(),
				linkLabel: this.translate.instant('shared.components.ListingActivityFeed.viewModel'),
				linkUrl: RouterMap.Watchlist.url([this.rootProperty.id, RouterMap.Watchlist.MODELING, this.masterModelDoc.propertyData.id]),
				redirect: this.router.url
			}
			feed.push(masterModelFeedItem)
		}

		if (this.addedDate) {
			// added to watchlist feed item
			const date = this.dateLangPipe.transform(this.addedDate)
			const addedToWatchlistFeedItem: ListingActivityFeed = {
				icon: ListingActivityFeedIconEnum.Added,
				text: this.translate.instant('page.watchlist.property-activity.feed.price.addedDate', { date }),
				// for user created models, the addedDate and master model date are identical, so we must substract 1 minute
				feedDate: new Date(this.addedDate).getTime() - 60 * 1000,
				linkLabel: this.translate.instant('shared.components.ListingActivityFeed.viewModel'),
				linkUrl: null
			}

			feed.push(addedToWatchlistFeedItem)
		}

		// sort feeds DESC
		feed.sort((a: ListingActivityFeed, b: ListingActivityFeed) => b.feedDate - a.feedDate)

		this.feed$.next(feed)
		this.feed = feed

		this.changeDetectorRef.detectChanges()

	}

	clearHeader() {
		this.header = {
			pictures: [],
			marketValue: {
				value: null,			// todo: API should return last sale price
				unit: UnitType.CAD,					// todo: API should return currency
			},
			listingType: undefined
		}
		this.header$.next(this.header)
		this.changeDetectorRef.detectChanges()
	}

	setHeader(property: WatchlistProperty) {
		this.header = {
			pictures: property.pictures,
			marketValue: {
				value: property.askPrice,			// todo: API should return last sale price
				unit: UnitType.CAD,					// todo: API should return currency
			}
		}
		if (property.listingType) {
			this.header.listingType = property.listingType
		}
		this.header$.next(this.header)
		this.changeDetectorRef.detectChanges()
	}

	setAddressStr(address: Address) {
		if (address.civicNumber !== undefined) {
			return `${address.civicNumber} ${address.civicNumber2 ? ' - ' + address.civicNumber2 : ''} ${address.street}`
		}
		else {
			return `${address.district}`
		}
	}

	viewProperty() {
		const propertyId = this.rootProperty.inheritedFrom || this.rootProperty.id
		if (propertyId) {
			this.router.navigate([RouterMap.Market.url([RouterMap.Market.PROPERTIES, propertyId])], { queryParams: { redirect: this.router.url } });
		}
	}

	calculator() {
		// if no calculation done yet, create the master model
		if (!this.masterModelDoc) {
			this.createMasterModel()
		}
		// else, create a child model from the parent
		else {
			this.addModel()
		}
	}

	viewModels() {
		if (this.masterModelDoc) {
			this.router.navigate([
				RouterMap.Watchlist.url([this.propertyId, RouterMap.Watchlist.MODELING])])
		} else {
			const message = this.translate.instant('page.watchlist.property-activity')
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
			]
			this.promptService.prompt('', message, promptChoices).toPromise()
		}
	}

	createMasterModel() {
		const config = this.formConfigAdapter.adapt(this.rootProperty)
		config.property.inheritedFrom = config.property.id
		delete config.property.id

		this.modalRef = this.layoutService.openModal(PropertyAddComponent, {
			config,
			complete: this.modalComplete
		}, false)
	}

	async addModel() {
		const modelCopy = { ...this.masterModelDoc.propertyData, parent: this.masterModelDoc.propertyData.id }
		const config = this.formConfigAdapter.adapt(modelCopy, this.masterModelDoc.hypothesisData)
		const modelCount = this.models.length + 1
		config.property.name = _translate(this.translate.instant('page.watchlist.property-model-list.newModel')) + ` (${modelCount})`
		delete config.property.id
		delete config.property.hypothesisId

		// Open the drawer if the usage is under the limit
		const propertyId = this.propertyId
		const { requiredPlan, currentPlan, upgradeRequired } = await this.plansService.minimumRequiredPlan('modeling_per_property', propertyId)
		config.property.parent = propertyId

		if (upgradeRequired) {
			const planName = this.translate.instant(`plans.${currentPlan}`)
			const newPlanName = this.translate.instant(`plans.${requiredPlan}`)
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
				{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
			]
			const translated = this.translate.instant('billing.prompt.limitReached.models', { planName, newPlanName })
			const res = await this.promptService.prompt('', translated, promptChoices).toPromise()
			if (res === 'yes') {
				const redirect = this.router.url
				this.router.navigate([RouterMap.Subscription.path], { queryParams: { plan: requiredPlan, redirect } })
			}
		}
		else {
			this.modalRef = this.layoutService.openModal(PropertyAddComponent, {
				config,
				complete: this.modalComplete
			}, false)
		}
	}

	back() {
		this.router.navigateByUrl(RouterMap.Watchlist.path)
	}

}
