import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { merge, Subscription } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { ModalRef } from '@app-models/modal-ref'
import { PropertySearchDrawerEvent, PropertySearchDrawerEventType } from '@app-models/property-search.interface'
import { PropertiesService } from '@app/core/localDB/properties.service'
import { PropertiesMiddlewareService } from '@app/api-middleware/properties-middleware.service'
import { LayoutService } from '@app/layout/service/layout.service'
import { PropertyAddComponent } from '@app/helper/property-add/property-add.component'
import { PropertyFormConfigAdapter } from '@app/helper/adapters/property-form-config.adapter'
import { SpinnerService } from '@app/shared/services/spinner.service'
import { RouterMap } from '@app/core/utils/router-map.util'
import { _translate } from '@app/core/utils/translate.util';
import { TranslateService } from '@ngx-translate/core';
import { PromptService } from '@app/shared/services/prompt.service';
import { PromptChoice } from '@app/core/models/prompt-choice.interface';
import { PlansService } from '@app/shared/services/plans.service';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { ActionDrawerOutletComponent } from '@app/layout/component/action-drawer-outlet/action-drawer-outlet.component';
import { ListingShort, PropertiesService as PropertiesApiService, ModelProperty, UnregisteredProperty, WatchlistProperty } from '@app/api_generated';
import { ModelPropertyShortDb } from '@app/core/models/modelPropertyShortDb'
import { PropertyPendingService } from '@app-services/property-pending.service';
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { WatchlistDbService, WatchlistDoc } from '@app/core/localDB/watchlist.service';
import { SyncService } from '@app/core/services/sync.service';
import { PropertyFormConfig } from '@app/helper/property-form-config';
import { WatchlistMiddlewareService } from '@app/core/services/watchlist-middleware.service';

@Component({
	selector: 'app-properties',
	templateUrl: './properties.component.html',
	styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit, OnDestroy {

	properties: ModelProperty[]
	watchlist: WatchlistDoc

	propertyFormComplete: EventEmitter<PropertyFormConfig> = new EventEmitter<any>()
	propertyAddModalRef: ModalRef

	activePropertySearchDrawer = false
	subscriptionsEnabled = true

	propertiesLoaded = false

	pendingProperties: UnregisteredProperty[]
	emptyProps = ['', '', '', '', '', '', '']
	sub: Subscription = new Subscription()

	@ViewChild('drawerOutlet', { static: true }) drawerOutlet: ActionDrawerOutletComponent

	@ViewChild('content', { static: true }) content
	propsCountMapping: any = {
		'=1': 'pages.watchlist.total_count',
		'other': 'pages.watchlist.total_counts'
	}
	constructor(
		private propertiesService: PropertiesService,
		private propertyMiddleware: PropertiesMiddlewareService,
		private formConfigAdapter: PropertyFormConfigAdapter,
		private layoutService: LayoutService,
		private spinnerService: SpinnerService,
		private translate: TranslateService,
		private promptService: PromptService,
		private plansService: PlansService,
		private userSettingsMiddleware: UserSettingsMiddlewareService,
		private router: Router,
		private route: ActivatedRoute,
		private watchlistDbService: WatchlistDbService,
		private propertyPendingService: PropertyPendingService,
		private tabsStatesService: TabsStatesService,
		private syncService: SyncService,
		private watchlistMiddlewareService: WatchlistMiddlewareService
	) { }

	async ngOnInit() {
		// load properties in background
		this.sub.add(
			this.syncService.watchlistReady$.pipe(filter(isReady => isReady)).subscribe((isReady) => {
				this.loadWatchlist()

				this.sub.add(
					this.route.queryParams.subscribe(params => {
						if (params['isNewProp']) {
							this.addPropertySearchDrawer()
						}
					})
				)

				this.sub.add(
					merge(
						this.watchlistDbService.addProperty$,
						this.watchlistDbService.removeProperty$
					).subscribe(() => {
						this.spinnerService.show()
						this.spinnerService.text = ''
						this.loadWatchlist()
					})
				)

				this.sub.add(
					this.watchlistDbService.changeModelsCount$.subscribe(() => {
						this.loadWatchlist()
					})
				)

			})
		)

		this.subscribeFormComplete()

		this.sub.add(
			this.propertyPendingService.pendingPropertyEvent.subscribe(async (res) => {
				this.pendingProperties = await this.propertyMiddleware.getPendingProperties().toPromise()
			})
		)

		this.propertyMiddleware.getPendingProperties().toPromise()
			.then(pendingProperties => this.pendingProperties = pendingProperties)

		// Route enter and leave subscriptions
		this.tabsStatesService.enter$.pipe(filter(url => url.replace('/', '') === RouterMap.Watchlist.path)).subscribe(url => {
			this.content.nativeElement && this.content.nativeElement.scrollTo(0, this.tabsStatesService.get('watchlist'))
		})

		this.tabsStatesService.leave$.pipe(filter(url => url.replace('/', '') === RouterMap.Watchlist.path)).subscribe(url => {
			this.tabsStatesService.save('watchlist', this.content.nativeElement.scrollTop)
		})

	}

	async subscribeFormComplete() {
		// Ref: https://blog.angular-university.io/rxjs-error-handling/
		// Save to API, then PouchDB. If it fails to save to API, then just save a the property object to PouchDB with the _id "temp_"
		this.propertyFormComplete.subscribe(async (formData) => {
			try {
				console.log('Property form complete', formData)

				const property = await this.propertiesService.saveFormData(formData)

				let url
				// User created property inherited from MREX property
				if (property.propertyData.inheritedFrom) {
					url = RouterMap.Watchlist.url([property.propertyData.inheritedFrom, RouterMap.Watchlist.MODELING, property.propertyData.id])
				}
				// The property doesn't exist in our DB
				else {
					url = RouterMap.Watchlist.url([property.propertyData.id, RouterMap.Watchlist.MODELING, property.propertyData.id])
				}
				await this.router.navigateByUrl(url)
				this.spinnerService.hide()
				this.propertyAddModalRef.closeModal()
			}
			catch (err) {
				console.error(err)
				this.spinnerService.hide()
				this.propertiesService.addingWatchListData.next(false)
			}
		})
	}

	ngOnDestroy() {
		this.subscriptionsEnabled = false
		this.sub.unsubscribe()
	}

	async onPendingDelete(deletedItem) {
		const message = this.translate.instant('pages.watchlist.delete_property_message')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		const res = await this.promptService.prompt('', message, promptChoices).toPromise()
		if (res === 'yes') {
			try {
				this.spinnerService.show()
				this.spinnerService.text = ''
				await this.watchlistDbService.deletePendingWatchlist(deletedItem.id)
				this.pendingProperties = await this.propertyMiddleware.getPendingProperties(true).toPromise()
				this.spinnerService.hide()
			}
			catch (err) {
				this.spinnerService.hide()
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			}
		}
	}

	async onDelete(deletedItem: WatchlistProperty) {
		const message = this.translate.instant('pages.watchlist.delete_property_message')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		const res = await this.promptService.prompt('', message, promptChoices).toPromise()

		if (res === 'yes') {
			try {
				this.propertiesService.deleteByPropertyId(deletedItem.id)
			}
			catch (err) {
				// silent error. This is for when the deleted property is not a user created property
				// Recall we have 3 cases: a user watch a property from the market, create a model from an existing MREX property
				// or create a model for a non existant MREX property
			}

			// the delete property was an existing property from our DB
			this.properties = this.properties.filter(x => x.id !== deletedItem.id)
			await this.watchlistDbService.removeProperty(this.watchlist, deletedItem.id)

			this.watchlistDbService.removeProperty$.next(deletedItem.id)

			await this.loadWatchlist()

			this.userSettingsMiddleware.sync() // sync the user to get the user usage
			this.layoutService.openSnackBar('page.watchlist.property-overview.removedConfirmation', null, 3000, 'info', false)

		}

	}

	async loadWatchlist() {
		this.watchlist = this.watchlistDbService.getCurrent()
		this.properties = this.watchlist.properties
		console.info('[Watchlist] Properties Load Finished', this.properties)

		this.propertiesService.addingWatchListData.next(false)
		this.propertiesLoaded = true
		this.spinnerService.hide()
	}


	// TODO: Add or Remove Component by using ViewContainerRef
	async addPropertySearchDrawer() {

		// Open the drawer if the usage is under the limit
		const { upgradeRequired, requiredPlan, currentPlan } = await this.plansService.minimumRequiredPlan('watchlist_items')

		if (upgradeRequired) {
			const planName = this.translate.instant(`plans.${currentPlan}`)
			const newPlanName = this.translate.instant(`plans.${requiredPlan}`)
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
				{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
			]
			const translated = this.translate.instant('billing.prompt.limitReached.watchlist', { planName, newPlanName })
			const answer = await this.promptService.prompt('', translated, promptChoices).toPromise()
			
			if (answer === 'yes') {
				const redirect = this.router.url
				this.router.navigate([RouterMap.Subscription.path], { queryParams: { plan: requiredPlan, redirect } })
			}
		}
		else {
			this.activePropertySearchDrawer = true
			this.drawerOutlet.openDrawer()
		}

	}

	removePropertySearchDrawer() {
		this.activePropertySearchDrawer = false
	}

	async onPropertySearchDrawerEventEmitted(event: PropertySearchDrawerEvent) {
		if (this.watchlist.properties.map(prop => prop.id).includes(event.data.id)) {
			this.layoutService.openSnackBar(this.translate.instant('watchlist.cannot-add-twice'), null, 5000, 'error')
		} else {
			if (event) {
				if (event.type === PropertySearchDrawerEventType.CREATE) {
					const obj: ModelPropertyShortDb = event.data
					const config = this.formConfigAdapter.adapt(obj as ModelProperty)
					console.log('[Properties List] Create Property Form Config', config)

					this.propertyAddModalRef = this.layoutService.openModal(PropertyAddComponent, {
						config,
						complete: this.propertyFormComplete
					}, false)
				}
				else if (event.type === PropertySearchDrawerEventType.IMPORT) {
					console.info('[Properties List] Import Property from Database', event)

					try {
						this.watchlistMiddlewareService.favorite(true, event.data.id)
					}
					catch (err) {
						const { prompt, requiredPlan } = err
						const response = await prompt.toPromise()
						if (response === 'yes') {
							const redirect = this.router.url
							this.router.navigate([RouterMap.Subscription.path], { queryParams: { plan: requiredPlan, redirect } })
						}
					}

				}
			}
		}
	}

	onPropertyClicked(property: ListingShort) {
		this.router.navigate([
			RouterMap.Watchlist.url([property.id, RouterMap.Watchlist.ACTIVITY])
		])
	}

	onPendingPropertyClicked(property) {
		this.router.navigate([
			RouterMap.Watchlist.url([property.portfolioId, RouterMap.Watchlist.ACTIVITY])
		])
	}
}
