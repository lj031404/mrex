import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { map, tap, take, filter, takeWhile, catchError } from 'rxjs/operators';

import { MarketService as MarketApiService } from '@app/api_generated/api/market.service'
import { ListingOffer, ListingType, SearchListingCriteriaGeoAddress, NoticesService, SearchListingCriteriaGeoAddressBounds, PortfolioSummary } from '@app/api_generated';

import { MapCriteria } from '@app-models/map-criteria'
import {
	PROPERTY_SORT_BY,
	PropertySearchOnMarketListing,
	PropertySearchResultOnMap
} from '@app-models/property-search.interface'
import { GeolocationService } from '@app/shared/services/geolocation.service';
import { ListingShort } from '@app/api_generated';
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { PortfolioService as ApiPortfolioService } from '@app/api_generated/api/portfolio.service'
import { HttpErrorResponse } from '@angular/common/http';
import { ListingDoc, ListingsService } from '@app/core/localDB/listings.service';

export interface FilterPad extends SearchListingCriteriaGeoAddress {
	address: string
}
const LISTINGS_LIMIT = 500
const MINUTES = 60 * 1000

@Injectable({
	providedIn: 'root'
})
export class MarketMiddlewareService {

	public mapCriteria: MapCriteria
	public filterCriteria: FilterPad

	private totalCount$ = new BehaviorSubject<number>(0)
	public filterChange$ = new Subject()

	public lastResult: PropertySearchOnMarketListing

	public scrollPosition = 0 // scroll position of the market list

	userPosition: { longitude: number, latitude: number }

	public activeTab: string

	public isSearchAddress: boolean
	public properties: ListingShort[] = []
	public propertyLoaded$: BehaviorSubject<{ resizeMap: boolean, properties: ListingShort[] }> = new BehaviorSubject({ resizeMap: true, properties: [] })
	public savedSearchData: Array<any>

	private listeningMarketLoadingStatus: Subject<boolean> = new Subject<boolean>();
	marketLoadingEvent$: Observable<boolean> = this.listeningMarketLoadingStatus.asObservable();

	public listeningMarketContentClicked: Subject<boolean> = new Subject<boolean>();
	marketContentClickEvent$: Observable<boolean> = this.listeningMarketContentClicked.asObservable();

	public marketNoteChange$: BehaviorSubject<string> = new BehaviorSubject<string>('')

	resizeMap: boolean

	get total() {
		return this.totalCount$.value
	}

	get totalCountObservable(): Observable<number> {
		return this.totalCount$.asObservable()
	}

	constructor(private marketApiService: MarketApiService,
		private noticesService: NoticesService,
		private layoutService: LayoutService,
		private translate: TranslateService,
		private apiPortfolioService: ApiPortfolioService,
		private listingsService: ListingsService,
		private geolocationService: GeolocationService) {

		// watch position changes
		setInterval(() => this.geolocationService.getPosition(), 15 * MINUTES)

		const positionReady$ = this.geolocationService.position$
			.pipe(
				filter(x => !!x),
				takeWhile(x => !!x)
			)

		// First time
		positionReady$
			.pipe(take(1))
			.subscribe((res) => {
				this.userPosition = this.geolocationService.position
				this.loadFilterCriteria()
				console.log('Market middleware ready')
			}, err => { })

		// Update the coordinates when the user position changes
		positionReady$
			.subscribe((res) => {
				this.filterCriteria.coordinates = [this.userPosition.longitude, this.userPosition.latitude]
				this.saveFilterCriteria()
			})

		this.activeTab = localStorage.getItem('marketActiveTab')

	}

	private loadFilterCriteria() {

		const filterCriteria = JSON.parse(localStorage.getItem('filterCriteria'))

		this.mapCriteria = new MapCriteria(this.userPosition.longitude, this.userPosition.latitude)
		const savedMapCriteria = JSON.parse(localStorage.getItem('mapCriteria'))

		if (savedMapCriteria) {
			this.mapCriteria.set(savedMapCriteria)
		}

		if (filterCriteria) {
			this.filterCriteria = filterCriteria
			this.filterCriteria.coordinates = [this.userPosition.longitude, this.userPosition.latitude]
			this.filterChange$.next()
		}
		else {
			console.log('Filter criteria does not exist')
			this.resetFilters()
			this.resetMapCriteria()
		}

		this.saveFilterCriteria()

	}

	public saveFilterCriteria() {
		localStorage.setItem('filterCriteria', JSON.stringify(this.filterCriteria))
	}

	public async resetMapCriteria() {
		this.mapCriteria = this.userPosition ? new MapCriteria(this.userPosition.longitude, this.userPosition.latitude) : new MapCriteria(0, 0)
		await this.mapCriteria.reset()
		localStorage.setItem('mapCriteria', JSON.stringify(this.mapCriteria))
	}

	public resetFilters() {

		const bounds = this.filterCriteria && this.filterCriteria.bounds ? Object.values(this.filterCriteria.bounds) as SearchListingCriteriaGeoAddressBounds : {}

		this.filterCriteria = {
			address: '',
			coordinates: this.userPosition ? [this.userPosition.longitude, this.userPosition.latitude] : [0, 0],
			bounds,
			placeId: '',
			criteria: {
				distance: 25,
				cashdown: [10000, 10000000],
				price: [100000, 50000000],
				residentialUnits: [5, 200],
				yearOfConstruction: [1800, new Date().getFullYear()],
				publishDays: [0, 360],
				listingType: [
					ListingType.Public, ListingType.OffMarket, ListingType.Pocket
				],
				notAcceptOffers: true,
				acceptOffers: true,
			},
			pagination: {
				skip: 0,
				limit: 50
			}
		}

		this.saveFilterCriteria()
	}

	public getCurrentFilterCriteria(): FilterPad {
		return this.filterCriteria
	}

	public setMapCriteria(criteria: MapCriteria) {
		this.mapCriteria.set(criteria)
		localStorage.setItem('mapCriteria', JSON.stringify(this.mapCriteria))
	}

	public setFilterCriteria(filter?: Partial<SearchListingCriteriaGeoAddress>, opt?) {
		this.filterCriteria = {
			... this.filterCriteria,
			...filter
		}
		this.resizeMap = !!(opt && opt.resizeMap)
		this.filterChange$.next()
	}

	// keep the same filters but replace by current position
	public async setCurrentPositionFilter() {
		await this.geolocationService.getPosition()
		this.userPosition = this.geolocationService.position
		const filterCriteria = this.filterCriteria
		filterCriteria.placeId = null
		filterCriteria.address = ''
		filterCriteria.coordinates = [this.userPosition.longitude, this.userPosition.latitude]
		filterCriteria.bounds = null
		this.setFilterCriteria(filterCriteria)
	}

	public loadPropertiesOnCurrentMap(): Observable<PropertySearchResultOnMap> {
		return this.listPropertiesWithCurrentFilterCriteria().pipe(
			map(({ properties, total }) => ({
				properties,
				groups: [],
				total
			}),
			tap((result: PropertySearchResultOnMap) => {
				this.totalCount$.next(result.total)
				this.lastResult = result
			})
		))
	}

	public listPropertiesWithCurrentFilterCriteria(skip: number = 0, limit: number = LISTINGS_LIMIT, sort: string | null = null, fetchApi = true): Observable<PropertySearchOnMarketListing> {

		try {
			const pagination = this.filterCriteria.pagination
			pagination.skip = skip || this.filterCriteria.pagination.skip
			pagination.limit = limit || this.filterCriteria.pagination.limit
			pagination.sort = sort || this.filterCriteria.pagination.sort

			this.saveFilterCriteria()
			return this.marketApiService.searchNearListingsByAddress({
				...this.filterCriteria,
				pagination
			}).pipe(
				map(response => ({
					total: response.count,
					properties: response.data
				})),
				tap(result => {
					this.totalCount$.next(result.total)
					this.lastResult = result

					this.propertyLoaded$.next({
						resizeMap: this.resizeMap,
						properties: result.properties
					})
				}),
				catchError((error: HttpErrorResponse) => {
					if (error && error.error && error.error.status >= 400) {
						try {
							this.layoutService.openSnackBar(this.translate.instant(error.error.code), null, 5000, 'error')
						} catch (error) {
							this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
						}
					}
					return throwError(error)
				})
			)
		} catch (error) {
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			return of(error)
		}

	}

	public getFilteredPropertiesCount(criteriaParams: SearchListingCriteriaGeoAddress): Observable<number> {
		return this.marketApiService.searchNearListingsByAddress({
			...criteriaParams,
			pagination: criteriaParams.pagination
		}, null, 'true').pipe(
			map(response => {
				return response.count
			})
		)
	}

	sortBy(sortBy: PROPERTY_SORT_BY, offset?: number, limit?: number) {
	}

	async getListing(listingId: string): Promise<ListingDoc> {
		const listing = await this.marketApiService.getListing(listingId).toPromise()
		return this.listingsService.save(listing)
	}

	async getProperty(propertyId: string, fetchApi = false): Promise<ListingDoc> {
		const doc = this.listingsService.getById(propertyId)
		const ONE_DAY = 86400000
		let property
		if (fetchApi) {
			property = await this.marketApiService.getMarketProperty(propertyId).toPromise()
			// TODO: implement a propertiesService. But it should work
			return this.listingsService.save(property)
		}
		else if (doc) {
			// Get from the API if more than 6 hours
			if ((+new Date() - doc.localUpdateTime) > ONE_DAY / 4) {
				property = await this.marketApiService.getMarketProperty(propertyId).toPromise()
				// TODO: implement a propertiesService. But it should work
				return this.listingsService.save(property)
			}
			// Take the value in the DB
			else {
				return doc
			}
		}
		else {
			property = await this.marketApiService.getMarketProperty(propertyId).toPromise()
			// TODO: implement a propertiesService. But it should work
			return this.listingsService.save(property)
		}
	}

	public sendNotice(offerData: ListingOffer, listingId: string): Observable<any> {
		return this.noticesService.sendNotice(offerData)
	}

	public saveActiveTab(activeTab: string) {
		this.activeTab = activeTab
		localStorage.setItem('marketActiveTab', activeTab)
	}

	public async getSavedSearchData(fetchApi = false): Promise<any> {
		return this.marketApiService.getSearchHistory().pipe(map(res => {
			if (res) {
				this.savedSearchData = res.map(item => ({
					...item,
					...item['searchParams']
				})).reverse()
			}

			return res
		})).toPromise()
	}

	public getPropertyComparable(propertyId: string, fetchApi = false): Promise<any> {
		return this.marketApiService.getPropertyComparables(propertyId).toPromise()
	}

	public getAdvancedSalesComparison(propertyId: string, comparisonId, fetchAPi = false): Promise<any> {
		return this.marketApiService.getPropertyComparableDetail(propertyId, comparisonId).toPromise()
	}

	updateMarketLoadingState(isLoading: boolean) {
		this.listeningMarketLoadingStatus.next(isLoading)
	}

	async getPortfolioSummary(fetchAPi = false): Promise<PortfolioSummary> {
		return this.apiPortfolioService.getPortfoliosSummary().toPromise()
	}

}
