import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'

import { RouterMap } from '@app/core/utils/router-map.util'
import { MarketMiddlewareService, FilterPad } from '@app/api-middleware/market-middleware.service'
import { _translate } from '@app/core/utils/translate.util';

import { MarketinfoshareService } from '../adapter/marketinfoshare.service'
import { GeolocationService } from '@app/shared/services/geolocation.service';
import { TabsStatesService } from '@app/shared/services/tabs-states.service';

@Component({
	selector: 'app-market-overview',
	templateUrl: './market-overview.component.html',
	styleUrls: ['./market-overview.component.scss']
})
export class MarketOverviewComponent implements OnInit {
	MarketMap = RouterMap.Market

	overviewUrl: string
	propertyCount$: Observable<number>

	subscription: Subscription = new Subscription()

	latitude: number
	longitude: number
	zoom: number
	address: string
	autocomplete
	filter: FilterPad
	currentTab: string// = RouterMap.Market.MAP
	@ViewChild('search', { static: false })
	public searchElementRef: ElementRef
	isMapLoading: boolean

	constructor(
		public middleware: MarketMiddlewareService,
		private infoService: MarketinfoshareService,
		private router: Router,
		private geolocationService: GeolocationService,
		private route: ActivatedRoute,
		private tabsStatesService: TabsStatesService
	) {
		this.propertyCount$ = this.middleware.totalCountObservable
		this.infoService.inputAddress$.subscribe(res => this.address = res)
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe((res: NavigationEnd) => {

			if (res.url.includes(RouterMap.Market.LIST)) {
				this.currentTab = RouterMap.Market.LIST
			}

			else if (res.url.includes(RouterMap.Market.MAP)) {
				this.currentTab = RouterMap.Market.MAP
			}

			else if (res.url.includes(RouterMap.Market.SAVED)) {
				this.currentTab = RouterMap.Market.SAVED
			}

			// If the URL is simply /market, just redirect to the current tab
			else if (res.url === '/' + RouterMap.Market.path) {
				this.switchTab(this.currentTab)
			}

		})

		this.route.queryParams.subscribe(res => {
			if (res['search']) {
				this.getPropertyFromSavedSearchId(res['search'])
			}
		})
	}

	async ngOnInit() {
		this.overviewUrl = this.MarketMap.url([this.MarketMap.OVERVIEW])
		this.address = this.middleware.filterCriteria && this.middleware.filterCriteria.address
		this.middleware.filterChange$.subscribe(async () => {
			if (this.currentTab === this.MarketMap.MAP) {
				this.isMapLoading = true
			}
			this.middleware.updateMarketLoadingState(true)

			this.address = this.middleware.filterCriteria.address
			await this.middleware.loadPropertiesOnCurrentMap().toPromise()
			this.isMapLoading = false
			this.middleware.updateMarketLoadingState(false)
		}, err => {
			this.isMapLoading = false
			this.middleware.updateMarketLoadingState(false)
		})

		if (!this.middleware.activeTab) {
			this.middleware.activeTab = this.currentTab
		}

		if (!this.isGeoReady) {
			this.isMapLoading = true
			await this.geolocationService.getPosition()
				.catch(err => {
					this.isMapLoading = false
				})
			this.isMapLoading = false
		}

		// if no search done before, show a default search
		if (!localStorage.getItem('filterCriteria')) {
			this.middleware.resetFilters()
			this.middleware.setFilterCriteria(this.middleware.filterCriteria)
			this.middleware.saveFilterCriteria()
		}

		// Route enter and leave subscriptions
		this.tabsStatesService.leave$.pipe(filter(url => url.includes(RouterMap.Market.path))).subscribe(url => {
			this.tabsStatesService.save('market-route', url)
		})
	}

	get isGeoReady(): boolean {
		return !!this.geolocationService.position
	}

	addressClick(address: any) {
		this.filter = this.middleware.getCurrentFilterCriteria()

		if (address) {
			this.filter.placeId = address.place_id
			this.filter.address = address.description
			this.infoService.getInputAddress(address.description)

			this.filter.bounds = null // let agp-map find the best bound when we know the place
			this.middleware.isSearchAddress = true

			if (this.currentTab === this.MarketMap.MAP) {
				this.isMapLoading = true
			}
			this.middleware.updateMarketLoadingState(true)
			this.middleware.setFilterCriteria(this.filter, { resizeMap: true })
		}
		else {
			this.filter.placeId = null
			this.filter.address = null
			this.filter.bounds = null
			this.infoService.getInputAddress(null)
			this.infoService.getInputSearchAddress(null)
			this.middleware.updateMarketLoadingState(true)
			this.middleware.setFilterCriteria(this.filter, { resizeMap: true })
		}
	}

	searchAddressClick(address) {
		if (address) {
			this.infoService.getInputSearchAddress(address.description)
		} else {
			this.infoService.getInputSearchAddress('')
		}
	}

	onUpdatePlace(res: any) {
		this.filter.coordinates = res.coordinates.coordinates
		this.filter.bounds = null // let agp-map find the best bound when we know the place

		if (this.currentTab === this.MarketMap.MAP) {
			this.isMapLoading = true
		}
		this.middleware.updateMarketLoadingState(true)
		this.middleware.setFilterCriteria(this.filter, { resizeMap: true })
	}

	switchTab(tab) {
		this.middleware.listeningMarketContentClicked.next(true)
		this.currentTab = tab;
		this.middleware.saveActiveTab(tab)
		this.infoService.getInputSearchAddress(this.address)
		this.router.navigate([RouterMap.Market.path, RouterMap.Market.OVERVIEW, tab])
	}

	async getPropertyFromSavedSearchId(searchId: string) {
		const savedSearchData = await this.middleware.getSavedSearchData()
		const filterCriteria = savedSearchData.find(item => item.id === searchId)
		if (filterCriteria && filterCriteria.searchParams) {
			if (this.currentTab === this.MarketMap.MAP) {
				this.isMapLoading = true
			}
			this.middleware.updateMarketLoadingState(true)
			this.middleware.setFilterCriteria(filterCriteria.searchParams, { resizeMap: true })
		}

	}
}
