import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { PropertyDataSource } from '@app-models/property-data-source';
import { MarketMiddlewareService } from '@app-middleware/market-middleware.service';
import { ListingShort } from '@app/api_generated';
import { MarketinfoshareService } from '../adapter/marketinfoshare.service';
import { filter, take } from 'rxjs/operators';
import { PropertiesService } from '@app/core/localDB/properties.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { FilterPadComponent } from '@app/pages/market/modals/filter-pad/filter-pad.component'
import { LayoutService } from '@app/layout/service/layout.service';
import { MarketService } from '@app/api_generated/api/market.service'
import { TranslateService } from '@ngx-translate/core';
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { RouterMap } from '@app/core/utils/router-map.util';
import { WatchlistDbService } from '@app/core/localDB/watchlist.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
export const LISTINGS_LIMIT = 500

@Component({
	selector: 'app-market-list',
	templateUrl: './market-list.component.html',
	styleUrls: ['./market-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketListComponent implements OnInit, OnDestroy, OnChanges {
	@Input() additionalHeight?= 0
	@Input() external?= false
	propertyCount$: Observable<number>

	listingDataSource = new PropertyDataSource<ListingShort>()
	listings: ListingShort[] = []

	becomeUserModalVisibility = false

	_selectHideFieldsProperty: any
	_subscription: Subscription = new Subscription()
	address: string

	isWatched = {}
	countModels = {}
	propertyCount = 0
	heightOfPropertyList
	searchId
	scrollIndex = 0

	@ViewChild('searchResultContent', { static: true }) searchResultContent
	@ViewChild('content', { static: true }) private content: ElementRef<HTMLElement>
	@ViewChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport

	lastRoute
	lastPosition

	emptyProps = ['', '', '', '']
	isLoading: boolean

	constructor(
		public middleware: MarketMiddlewareService,
		private marketMiddlewareService: MarketMiddlewareService,
		private infoService: MarketinfoshareService,
		private propertiesService: PropertiesService,
		private spinnerService: SpinnerService,
		private layoutService: LayoutService,
		private marketService: MarketService,
		public router: Router,
		private translate: TranslateService,
		private route: ActivatedRoute,
		private tabsStatesService: TabsStatesService,
		private watchlistDbService: WatchlistDbService,
		private changeDetectorRef:ChangeDetectorRef
	) {
		this._subscription.add(
			this.infoService.inputAddress$.subscribe(res => {
				this.address = res
			})
		)

		this.propertyCount$ = this.middleware.totalCountObservable

		this._subscription.add(
			this.middleware.totalCountObservable.subscribe(res => {
				this.propertyCount = res
			})
		)

		this._subscription.add(
			this.route.queryParams.subscribe(res => {
				this.searchId = res['search']
			})
		)

		this.middleware.marketLoadingEvent$.subscribe(
			res => {
				this.isLoading = res
				this.changeDetectorRef.detectChanges()
			}
		)

		this.address = this.middleware.filterCriteria && this.middleware.filterCriteria.address

		this.listingDataSource.pageSize = LISTINGS_LIMIT
		if (!this.external) {
			this.loadListings(false, 0, LISTINGS_LIMIT)
		}

		this.middleware.propertyLoaded$
			.subscribe(({ properties }) => {
				this.listingDataSource.next(properties, true)
				this.viewport && this.viewport.scrollToIndex(0)

				// watched properties flags
				this.watchlistDbService.getCurrent().properties.forEach((p: any) => {
					this.isWatched[p.propertyId] = true
				})
			})

		this._subscription.add(
			this.listingDataSource.loadMore
				.subscribe(({ offset, limit }) => this.loadListings(false, offset, limit))
		)

		this.listingDataSource.data$.subscribe(listings => {
			this.listings = listings.map(x => ({...x}))
			this.changeDetectorRef.markForCheck()
		})

	}

	get propCount() {
		return this.propertyCount
	}

	async ngOnInit() {
		// Route enter and leave subscriptions
		this.tabsStatesService.enter$.pipe(filter(url => url.includes(RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.LIST])))).subscribe(url => {
			this.content.nativeElement.children[0].scrollTo(0, this.tabsStatesService.get('market-list'))
			this.changeDetectorRef.detectChanges()
		})

		this.tabsStatesService.leave$.pipe(filter(url => url.includes(RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.LIST])))).subscribe(url => {
			this.tabsStatesService.save('market-list', this.content.nativeElement.children[0].scrollTop)
		})

		// count models for each listings
		const models = this.propertiesService.listPropertiesAndModels()
		const parentModels = models.filter(x => !x.propertyData.parent)
		parentModels.forEach(p => {
			this.countModels[p.propertyData.id] = models.filter(m => m.propertyData.parent === p.propertyData.id).length
		})

		this.watchlistDbService.addProperty$.pipe(filter(x => !!x)).subscribe((id) => {
			this.isWatched[id] = true
		})
		this.watchlistDbService.removeProperty$.pipe(filter(x => !!x)).subscribe((id) => {
			this.isWatched[id] = false
		})
	}

	ngOnChanges() {
		if (this.external) {
			this.propertyCount = 0
		}
	}

	ngOnDestroy(): void {
		if (this._subscription) {
			this._subscription.unsubscribe()
		}
	}

	onSortChange(event: any) {
		const value = event.target.value
		this.marketMiddlewareService.filterCriteria.pagination.sort = value
		this.marketMiddlewareService.setFilterCriteria()
	}

	async loadListings(overwrite: boolean, offset: number, limit: number) {
		if (this.middleware.lastResult && !overwrite) {
			this.listingDataSource.next(this.middleware.lastResult.properties, false)
		}
		else {
			try {
				this.spinnerService.text = ''
				const response = await this.middleware.listPropertiesWithCurrentFilterCriteria(offset, limit, null, true).toPromise()
				if (response) {
					this.listingDataSource.next(response.properties, overwrite)
				}
				this.spinnerService.hide()
			}
			catch (err) {
				this.spinnerService.hide()
			}
		}
	}

	openFilterModal() {
		this.layoutService.openModal(FilterPadComponent)
	}

	get paginationViewHeight() {
		this.heightOfPropertyList = {
			'height': `calc(100vh - 8.71rem - 4.39rem - ${this.searchResultContent.nativeElement.offsetHeight / 14}rem - ${this.additionalHeight}rem)`
		}
		return this.heightOfPropertyList
	}

	saveSearch() {
		this.spinnerService.show()
		this.spinnerService.text = ''
		this.marketService.createSearchHistoryItem(this.middleware.filterCriteria).pipe(take(1)).subscribe(
			async (res) => {
				this.spinnerService.hide()
				this.layoutService.openSnackBar(this.translate.instant('pages.marketlist.search.saved_successfully'), null, 5000, 'info')
				await this.marketMiddlewareService.getSavedSearchData(true)
			},
			err => {
				this.spinnerService.hide()
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			}
		)
	}

	updateSearch() {
		this.spinnerService.show()
		this.spinnerService.text = ''
		this.marketService.updateSearchHistoryItem(this.middleware.filterCriteria, this.searchId).pipe(take(1)).subscribe(
			async (res) => {
				await this.marketMiddlewareService.getSavedSearchData(true)
				this.spinnerService.hide()
				this.layoutService.openSnackBar(this.translate.instant('pages.marketlist.search.updated_successfully'), null, 5000, 'info')
			},
			err => {
				this.spinnerService.hide()
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			}
		)
	}

	trackBy(_, listing) {
		return listing.propertyId
	}

	onScrollIndexChange(scrollIndex) {
		this.scrollIndex = scrollIndex
	}

}
