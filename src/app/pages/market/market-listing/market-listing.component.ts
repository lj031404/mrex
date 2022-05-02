import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Input, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core'
import { Location } from '@angular/common'

import { LayoutService } from '@app/layout/service/layout.service'
import { AppNumberPipe } from '@app-pipes/number.pipe'
import { TranslateService } from '@ngx-translate/core'
import { _translate } from '@app/core/utils/translate.util'
import { StreetViewComponent } from '@app-components/street-view/street-view.component'

import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service'
import { MarketListingAdapter } from '../adapter/market-listing.adapter'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'

import { TableColumnInterface as MarketTableColumn } from '../components/market-data-table/market-data-table.component'
import { MakeOfferComponent } from '../modals/make-offer/make-offer.component'
import { ListingType } from '@app/api_generated'
import { take, filter } from 'rxjs/operators'
import { PictureSlider } from '@app/shared/components/picture-slider/picture-slider.component'
import { ModalRef } from '@app/core/models/modal-ref'
import { PropertyAddComponent } from '@app/helper/property-add/property-add.component'
import { PropertyFormConfig } from '@app/helper/property-form-config'
import { PropertiesService } from '@app/core/localDB/properties.service'
import { Property } from '@app/core/models/property.interface'
import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { RouterMap } from '@app/core/utils/router-map.util'
import { PromptService } from '@app/shared/services/prompt.service';
import { PromptChoice } from '@app/core/models/prompt-choice.interface'
import { PlansService } from '@app/shared/services/plans.service'
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service'
import { XYLineChart } from '@app-models/chart.interface';
import { CalculatorService } from '@app/shared/services/calculator.service'
import { Meter } from '@app/core/models/meter.interface';
import { MatDialog } from '@angular/material'
import { MarketService as ApiMarketService } from '@app/api_generated/api/market.service';
import { HomeService } from '@app-core/services/home.service'
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { WatchlistDbService } from '@app/core/localDB/watchlist.service'
import { ImageViewerDialogComponent } from '@app/shared/components/picture-slider/image-viewer-dialog/image-viewer-dialog.component'
import { ListingDoc } from '@app/core/localDB/listings.service'
import { TimeDuration } from '@app/shared/utils'
import { WatchlistMiddlewareService } from '@app/core/services/watchlist-middleware.service'

export type RESOLUTION = 100 | 480 | 1280

export const RESOLUTIONS = {
	'100': 100 as RESOLUTION,
	'480': 480 as RESOLUTION,
	'800': 800 as RESOLUTION,
	'1280': 1280 as RESOLUTION,
}

enum MapViewButtons {
	Map = 'map',
	StretView = 'street-view'
}
@Component({
	selector: 'app-market-listing',
	templateUrl: './market-listing.component.html',
	styleUrls: ['./market-listing.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketListingComponent implements OnInit, AfterViewInit {
	@Input() modalRef: ModalRef

	property: ListingDoc
	property$: BehaviorSubject<ListingDoc> = new BehaviorSubject(undefined)

	slider: PictureSlider
	isFavorite = false
	scopes: string[] = []
	banks: string[] = []
	propertyId: string
	ListingType = ListingType

	addressTitle: string

	masterModel: Property | null
	config: PropertyFormConfig

	modalPropertyRef: ModalRef;
	modalComplete = new EventEmitter<any>()

	subscriptionsEnabled = true

	@ViewChild('imageGallery', { static: true }) imageGallery: ElementRef<HTMLElement>
	@ViewChild('streetView', { static: false }) streetView: StreetViewComponent
	@ViewChild('content', { static: true }) private content: ElementRef<HTMLElement>

	mapView: 'map' | 'street-view' = 'map'
	hideFields = true

	imageGalleryHeight = 100
	secondaryHeaderVisibility = false
	offerPanelVisibility = true
	showNoticeOfInterest = false

	addressLine1 = ''
	subscription = new Subscription()
	featureColumns: MarketTableColumn[] = [
		{ name: 'feature' },
		{ name: 'value', pipe: { pipe: new AppNumberPipe(), args: ['1.0-0', ' ', '', ''] } },
	]
	acquisitionCostColumns: MarketTableColumn[] = [
		{ name: 'label' },
		{ name: 'share', pipe: { pipe: new AppNumberPipe(), args: ['1.0-0', ' ', '', '%'] } },
		{ name: 'value', pipe: { pipe: new AppNumberPipe(), args: ['1.0-0', ' ', '', '$'] } },
	]
	incomeColumns: MarketTableColumn[] = [
		{ name: 'label' },
		{ name: 'share', pipe: { pipe: new AppNumberPipe(), args: ['1.0-0', ' ', '', '%'] } },
		{ name: 'value', pipe: { pipe: new AppNumberPipe(), args: ['1.0-0', ' ', '', '$'] } }
	]
	expensesColumns: MarketTableColumn[] = [
		{ name: 'label' },
		{ name: 'share', pipe: { pipe: new AppNumberPipe(), args: ['1.0-0', ' ', '', '%'] } },
		{ name: 'value', pipe: { pipe: new AppNumberPipe(), args: ['1.0-0', ' ', '', '$'] } }
	]
	qualificationColumns: MarketTableColumn[] = [
		{ name: 'label' },
		{ name: 'value' }
	]

	historicalPerformanceChartData: XYLineChart;
	isPropertyActionsEnabled: boolean

	valuationMeter: Meter
	rentMeter: Meter
	isDev = false
	currentUrl = ''
	loading
	MapViewButtons = MapViewButtons
	modelsCount: number
	eventExpands: Subject<boolean> = new Subject<boolean>();

	constructor(
		private middleware: MarketMiddlewareService,
		private route: ActivatedRoute,
		private marketListingAdapter: MarketListingAdapter,
		private layoutService: LayoutService,
		public translate: TranslateService,
		private location: Location,
		private propertiesService: PropertiesService,
		private router: Router,
		private userSettingsMiddleware: UserSettingsMiddlewareService,
		private promptService: PromptService,
		private plansService: PlansService,
		private calculatorService: CalculatorService,
		private userSettingsMiddlewareService: UserSettingsMiddlewareService,
		public dialog: MatDialog,
		private apiMarketService: ApiMarketService,
		public homeService: HomeService,
		private tabsStatesService: TabsStatesService,
		public watchlistDbService: WatchlistDbService,
		private changeDetectorRef: ChangeDetectorRef,
		private watchlistMiddlewareService: WatchlistMiddlewareService
	) {
		router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			filter((event: NavigationEnd) => event.url.includes(RouterMap.Market.path + '/' + RouterMap.Market.PROPERTIES)),
		).subscribe(() => {
			this.changeDetectorRef.markForCheck()
			this.clear()
			this.onRouteChange()
		})
	}

	clear() {
		this.property = undefined
		this.modelsCount = 0
		this.historicalPerformanceChartData = undefined
		this.valuationMeter = undefined
		this.rentMeter = undefined
		this.isFavorite = false
		this.scopes = []
		this.banks = []
		this.propertyId = undefined
		this.addressTitle = ''
		this.masterModel = null
		this.config = undefined
		this.slider = {
			pictures: [],
			options: undefined
		}
		this.secondaryHeaderVisibility = false
		this.changeDetectorRef.detectChanges()
		this.updateExpand_child()
	}

	updateExpand_child() {
		this.eventExpands.next(false)
	}

	async onRouteChange() {
		try {
			this.currentUrl = this.router.url.split('?')[0] // remove any trailing query param

			// Retrieve the listing (disabled for now)
			this.propertyId = this.route.snapshot.paramMap.get('propertyId')

			if (this.propertyId) {
				this.loading = true

				const property = this.property = await this.middleware.getProperty(this.propertyId)

				const add = property.address
				this.addressTitle = `${add.civicNumber} ${add.civicNumber2 ? '-' + add.civicNumber2 : ''} ${add.street}, ${add.city}`
				this.addressLine1 = `${add.civicNumber} ${add.civicNumber2 ? '-' + add.civicNumber2 : ''} ${add.street}`

				// adjust the usage
				this.checkUsage()

				try {
					this.property = { ...property, ...this.marketListingAdapter.adapt(property) }
					this.property$.next(this.property)

					this.config = await this.prepareCalculator(this.property)
					const { properties } = this.watchlistDbService.getCurrent()

					this.slider = {
						pictures: this.property.pictures.filter(p => p.width ? p.width === RESOLUTIONS[800] : true)
					}

					const propertyIds = properties.map(x => x.inheritedFrom || x.id)
					this.isFavorite = Boolean(propertyIds.find(p => p === this.property.id))

					this.loading = false

					if (this.property && this.property.views && this.property.historicalPerformance) {
						this.historicalPerformanceChartData = {
							id: 'historical1',
							title: this.translate.instant('page.market.market_listing.annual_gains'),
							isShowBeta: true,
							valueUnit: '$',
							graphData: this.property.views.historicalPerformance.map(data => ({
								year: data.year.toString(),
								value: data['amount'],
								betaData: data['annualYield']
							}))
						}
					}

					this.hideFields = property.hideFields

					// Buttons are shown if the property is not in the portfolio
					const portfolioProps = (await this.middleware.getPortfolioSummary()).properties
					this.isPropertyActionsEnabled = !portfolioProps.find(x => x.propertyId === this.property.propertyId)

					this.getValuationMeter()

					try {
						this.modelsCount = this.watchlistDbService.getCurrent().properties.find(p => p.id === this.propertyId).models.length
					}
					catch (err) {}

				}
				catch (err) {
					this.loading = false
					this.layoutService.openSnackBar(this.translate.instant('page.market.listing.error'), null, 5000, 'error')
					console.error(err)
				}
			}
		}
		catch (err) {
			console.error(err)
			this.loading = false
			this.layoutService.openSnackBar(this.translate.instant('page.market.listing.error'), null, 5000, 'error')
		}

		this.changeDetectorRef.detectChanges()
	}

	async ngOnInit() {
		this.content.nativeElement.addEventListener('scroll', this.scrollHandler.bind(this), true)
		this.imageGalleryHeight = window.innerHeight * 0.35
		this.isDev = await this.userSettingsMiddleware.isDev()
		this.changeDetectorRef.detectChanges()

		this.middleware.marketNoteChange$.subscribe(async () => {
			const property = await this.middleware.getProperty(this.propertyId, true)
			this.property = { ...property, ...this.marketListingAdapter.adapt(property) }
			this.property$.next(this.property)
			this.changeDetectorRef.markForCheck()
		})

	}

	positionPreserve() {
		// Route enter and leave subscriptions
		this.tabsStatesService.enter$.pipe(filter(url => !url.includes(RouterMap.Market.ADD_NOTE) && url.includes(RouterMap.Market.url([RouterMap.Market.PROPERTIES])))).subscribe(url => {
			this.content.nativeElement.scrollTo(0, this.tabsStatesService.get(`marketListing-scrollY_${this.propertyId}`))
		})

		this.tabsStatesService.leave$.pipe(filter(url => !url.includes(RouterMap.Market.ADD_NOTE) && url.includes(RouterMap.Market.url([RouterMap.Market.PROPERTIES])))).subscribe(url => {
			this.tabsStatesService.save(`marketListing-scrollY_${this.propertyId}`, this.content.nativeElement.scrollTop)
		})
	}

	ngAfterViewInit() {
		this.positionPreserve()
	}

	getValuationMeter() {
		if (this.property.valuationMeter) {
			this.valuationMeter = {
				low: this.property.valuationMeter.low,
				media: this.property.valuationMeter.median,
				high: this.property.valuationMeter.high,
				value: this.property.valuationMeter.value,
				units: '$',
				labels: ['Low', 'Median', 'High']
			}
		}

		if (this.property.rentMeter) {
			this.rentMeter = {
				low: this.property.rentMeter.low,
				media: this.property.rentMeter.median,
				high: this.property.rentMeter.high,
				value: this.property.rentMeter.value,
				units: '$',
				labels: ['Low', 'Median', 'High']
			}
		}

	}

	clickForbiddenPanel() {
		if (this.hideFields) {
			const message = this.translate.instant('page.market.listing.modal-indicate-interest')
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
			]
			this.promptService.prompt('', message, promptChoices).toPromise()
		}
	}

	async subscribeFormComplete() {
		this.subscription.add(
			this.modalComplete.subscribe(async (formData) => {
				try {
					console.log('Property form complete', formData)

					const property = await this.propertiesService.saveFormData(formData)

					const url = RouterMap.Watchlist.url([this.property.id, RouterMap.Watchlist.MODELING, property.propertyData.id])
					await this.router.navigate([url])

					this.propertiesService.addingWatchListData.next(false)

					this.modalPropertyRef.closeModal()
					this.changeDetectorRef.detectChanges()
					this.subscription.unsubscribe()
				}
				catch (err) {
					console.error(err)
					this.propertiesService.addingWatchListData.next(false)
				}
			})
		)

	}

	async prepareCalculator(listing: ListingDoc) {
		return this.calculatorService.getConfigFromListing(listing)
	}

	back() {
		this.modalRef ? this.modalRef.closeModal() : this.router.navigateByUrl(this.route.snapshot.queryParams.redirect || RouterMap.Market.path)
	}

	async favorite() {
		try {
			this.isFavorite = !this.isFavorite
			await this.watchlistMiddlewareService.favorite(this.isFavorite, this.propertyId)
		}
		catch (err) {
			const { prompt, requiredPlan } = err
			const response = await prompt.toPromise()
			if (response === 'yes') {
				const redirect = this.router.url

				this.router.navigate([RouterMap.Subscription.path], { queryParams: { plan: requiredPlan, redirect } }).then(res => {
					if (this.modalRef) {
						this.modalRef.closeModal()
					}
				})
			}
			else {
				this.isFavorite = !this.isFavorite
				this.changeDetectorRef.detectChanges()
			}
		}
	}

	onViewMapClicked() {
		this.mapView = 'map'
	}

	onStreetViewClicked() {
		this.mapView = 'street-view'
		this.streetView.reset()
	}

	async sendNotice() {
		const { upgradeRequired, requiredPlan } = await this.plansService.minimumRequiredPlan('market.makeOffer')

		if (upgradeRequired) {
			const user: any = await this.userSettingsMiddleware.user
			const planName = this.translate.instant(`plans.${user.subscription.plan}`)
			const newPlanName = this.translate.instant(`plans.${requiredPlan}`)
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
				{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
			]
			const translated = this.translate.instant('billing.prompt.upgradeRequired', { planName, newPlanName })
			const res = await this.promptService.prompt('', translated, promptChoices).toPromise()
			if (res === 'yes') {
				const redirect = RouterMap.Market.url([RouterMap.Market.PROPERTIES, this.propertyId])
				await this.router.navigate([RouterMap.Subscription.path], { queryParams: { plan: requiredPlan, redirect } })
				if (this.modalRef) {
					this.modalRef.closeModal()
				}
			}
		}
		else {
			const modal = this.layoutService.openModal(MakeOfferComponent, {
				listingId: this.property.listingId,
				propertyId: this.property.propertyId,
			})
			modal.closed$.toPromise()
		}

	}

	get isNoticeEnabled() {
		return !(this.userSettingsMiddleware.user.metadata.noticeListings || []).includes(this.propertyId)
	}

	hideOfferPanel() {
		this.offerPanelVisibility = false
	}

	async calculator() {
		const choices = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn btn-outline-green' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		const res = await this.promptService.prompt('', this.translate.instant('page.market.market-listing.text'), choices).toPromise()

		if (res === 'yes') {
			// check if an upgrade is required
			const { upgradeRequired, requiredPlan, currentPlan } = await this.plansService.minimumRequiredPlan('watchlist_items')

			// If upgrade is required, redirect to the subscription page
			if (upgradeRequired) {
				const planName = this.translate.instant(`plans.${currentPlan}`)
				const newPlanName = this.translate.instant(`plans.${requiredPlan}`)

				const promptChoices: PromptChoice[] = [
					{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
					{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
				]

				const translated = this.translate.instant('billing.prompt.limitReached.watchlist', {
					planName,
					newPlanName
				})

				const res = await this.promptService.prompt('', translated, promptChoices).toPromise()
				if (res === 'yes') {
					const redirect = RouterMap.Market.url([RouterMap.Market.PROPERTIES, this.propertyId])
					await this.router.navigate([RouterMap.Subscription.path], { queryParams: { plan: requiredPlan, redirect } })
					if (this.modalRef) {
						this.modalRef.closeModal()
					}
				}
				else {
					this.modalRef && this.modalRef.closeModal()
				}
			}
			else {
				this.subscribeFormComplete()
				this.modalPropertyRef = this.layoutService.openModal(PropertyAddComponent, {
					config: this.config,
					complete: this.modalComplete
				}, false)
			}

		}
	}

	async createPortfolioProperty() {
		const choices = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn btn-outline-green' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		const res = await this.promptService.prompt('', this.translate.instant('page.market.market-listing.confirm_property_you_own'), choices).toPromise()

		if (res === 'yes') {
			const data = {
				id: this.property.propertyId,
				residentialUnits: this.property.residentialUnits,
				address: this.property.address.fullAddress,
				image: this.property.image
			}
			setTimeout(() => {
				this.router.navigate([RouterMap.Portfolio.url([RouterMap.Portfolio.NEW])], {
					queryParams: {
						propertyId: this.property.propertyId,
						propertyData: JSON.stringify(data)
					}
				})
			}, 1000)
		}

	}

	async checkUsage() {
		if (this.property && this.property.listingType !== ListingType.OffMarket) {
			return
		}

		// allow users to see off market properties they already saw
		if (this.property.listingType === ListingType.OffMarket && Object.keys(this.userSettingsMiddlewareService.user.usage.viewedOffMarketPropertyIds).includes(this.propertyId)) {
			return
		}

		// Retrieve the latest user usage
		await this.userSettingsMiddlewareService.sync()

		// TODO: instead, update the user object using a socket (when an offmarket property is watched, it will be updated in the user object
		// and an event will be emitted).
		const user = this.userSettingsMiddlewareService.user
		const { upgradeRequired, requiredPlan, requiredPlanLabel, currentPlan } = await this.plansService.minimumRequiredPlan('off_market_listings')

		const usage = parseInt(user.usage.off_market_listings)
		const limit = parseInt(user.subscription.limits.off_market_listings)

		// upgradeRequired
		if (usage > limit && upgradeRequired) {
			const planName = this.translate.instant(`plans.${currentPlan}`)
			const newPlanName = this.translate.instant(`plans.${requiredPlan}`)
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.upgrade'), class: 'btn' },
				{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
			]
			const translated = this.translate.instant('billing.prompt.limitReached.offmarket', {
				planName,
				limit,
				newPlanName
			})
			const res = await this.promptService.prompt('', translated, promptChoices).toPromise()
			if (res === 'yes') {
				const redirect = RouterMap.Market.url([RouterMap.Market.PROPERTIES, this.propertyId])
				this.router.navigate([RouterMap.Subscription.path], { queryParams: { plan: requiredPlan, redirect } }).then(res => {
					if (this.modalRef) {
						this.modalRef.closeModal()
					}
				})

			}
			else {
				this.modalRef ? this.modalRef.closeModal() : this.location.back()
			}
		}

		// show the number of offmarket listing properties to view
		else if (usage > 0.75 * limit) {
			const planName = this.translate.instant(`plans.${currentPlan}`)
			const newPlanName = this.translate.instant(`plans.${requiredPlan}`)
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' }
			]
			const translated = this.translate.instant('billing.prompt.limitReached.offmarketRemainingUnits', {
				usage,
				limit,
				remaining: limit - usage,
				planName,
				newPlanName,
			})
			const res = await this.promptService.prompt('', translated, promptChoices).toPromise()
		}

		this.changeDetectorRef.detectChanges()
	}

	addNotes(isAdd = true) {
		this.router.navigate([RouterMap.Market.path, RouterMap.Market.PROPERTIES, this.propertyId, RouterMap.Market.ADD_NOTE], { queryParams: { notes: isAdd ? '' : this.property.note } })
	}

	async removeNotes() {
		const message = this.translate.instant('pages.watchlist.delete_note')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		const res = await this.promptService.prompt('', message, promptChoices).toPromise()

		if (res === 'yes') {
			try {
				await this.apiMarketService.updateListingNote({ note: '' }, this.propertyId).toPromise()
				this.property = {
					...this.property,
					note: ''
				}
				this.property$.next(this.property)
				this.layoutService.openSnackBar('pages.market.note.delete_successfully', null, 3000, 'info', false)
				await this.middleware.getProperty(this.propertyId, true)
			}
			catch (err) {
				if (err.status >= 400) {
					this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
				}
			}
		}

		this.changeDetectorRef.detectChanges()

	}

	openSalesComps() {
		this.router.navigateByUrl(RouterMap.Market.url([RouterMap.Market.PROPERTIES, this.property.propertyId, RouterMap.Market.SALES_COMPS]))
	}

	scrollHandler() {
		if (this.content.nativeElement.scrollTop > 320) {
			this.secondaryHeaderVisibility = true
		} else {
			this.secondaryHeaderVisibility = false
		}
		this.changeDetectorRef.detectChanges()
	}

	openImageViewDlg(currentIndex: number) {
		this.dialog.open(ImageViewerDialogComponent, {
			panelClass: 'image-viewer-dialog',
			backdropClass: 'image-viewer-backdrop',
			data: {
				slider: {
					pictures: this.property.pictures
				},
				currentIndex
			}
		})
		this.changeDetectorRef.detectChanges()
	}

}
