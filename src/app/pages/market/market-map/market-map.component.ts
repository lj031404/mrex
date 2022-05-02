import { Component, OnInit, ViewChild } from '@angular/core'
import { ControlPosition, ZoomControlOptions, ZoomControlStyle, AgmInfoWindow } from '@agm/core';

import { Subject, Subscription } from 'rxjs'
import { debounceTime, filter, take } from 'rxjs/operators'
import { MapCriteria } from '@app/core/models/map-criteria'
import { ListingShort } from '@app/api_generated';
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service'
import { GeolocationService } from '@app/shared/services/geolocation.service'
import { LayoutService } from '@app/layout/service/layout.service'
import { ActionDrawerOutletComponent } from '@app/layout/component/action-drawer-outlet/action-drawer-outlet.component'

import { FilterPadComponent } from '@app/pages/market/modals/filter-pad/filter-pad.component'

import { GlobalService } from '@app/core/services/global.service'
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { PromptChoice } from '@app/core/models/prompt-choice.interface'
import { TranslateService } from '@ngx-translate/core'
import { PromptService } from '@app/shared/services/prompt.service'
import { TabsStatesService } from '@app/shared/services/tabs-states.service'
import { RouterMap } from '@app/core/utils/router-map.util'
import MarkerClusterer, { MarkerClustererOptions } from '@googlemaps/markerclustererplus';
import { Cluster } from '@googlemaps/markerclustererplus/dist/cluster';

interface MapChangeEvent {
	event: 'center' | 'zoom' | 'bounds',
	latLngBounds: google.maps.LatLngBounds
}

interface PropertyEntity extends ListingShort {
	id?: string,
	markerIcon?: string
}

@Component({
	selector: 'app-market-map',
	templateUrl: './market-map.component.html',
	styleUrls: ['./market-map.component.scss']
})
export class MarketMapComponent implements OnInit {
	map: google.maps.Map

	mapCriteria: MapCriteria
	properties: PropertyEntity[]
	markers: google.maps.Marker[] = []

	userPosition: { latitude: number, longitude: number }
	mapChangeSubject = new Subject<MapChangeEvent>()
	isClicked = {}
	searchAddress: {
		address: string,
		latitude: number,
		longitude: number,
		coordinates: any
	};
	_subscription: Subscription = new Subscription()
	// flag to enable the map auto-resize
	resizeMap = false
	selectedProperties: PropertyEntity[] = []
	activeListingDrawer = false
	bounds
	isFlyTo = true;
	isShowGpsErrorBar: boolean
	indexOfPropertyDrawer = 3
	markerCluster: MarkerClusterer
	markerAddress:string = ''
	@ViewChild('drawerOutlet', { static: true }) drawerOutlet: ActionDrawerOutletComponent

	checkStateDlgRef

	disableBtn: boolean = false
	propsContent

	currentIW: AgmInfoWindow = null
	previousIW: AgmInfoWindow = null
	_zoomControlOptions: ZoomControlOptions = {
		position: ControlPosition.TOP_LEFT,
		style: ZoomControlStyle.DEFAULT
	}
	constructor(
		public middleware: MarketMiddlewareService,
		private geolocationService: GeolocationService,
		private layoutService: LayoutService,
		private globalService: GlobalService,
		private diagnostic: Diagnostic,
		private translate: TranslateService,
		private promptService: PromptService,
		private tabsStatesService: TabsStatesService
	) {
		// Route enter and leave subscriptions
		try {
			this.tabsStatesService.enter$.pipe(filter(url => url.includes(RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.MAP])))).subscribe(url => {
				this.propsContent && this.propsContent.scrollTo(this.tabsStatesService.get('marketMap'), 0)
			})

			this.tabsStatesService.leave$.pipe(filter(url => url.includes(RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.MAP])))).subscribe(url => {
				this.propsContent && this.tabsStatesService.save('marketMap', this.propsContent.scrollLeft)
			})
		} catch (error) {

		}

		this._subscription.add(
			this.middleware.marketContentClickEvent$.pipe(filter(res => res)).subscribe(
				res => {
					this.selectedProperties = []
				}
			)
		)

	}

	async ngOnInit() {
		this.mapCriteria = this.middleware.mapCriteria
		this.userPosition = this.geolocationService.position

		this.geolocationService.position$.subscribe((position) => {
			this.userPosition = position
		})

		this.geolocationService.getPosition()
			.catch(err => {
				this.isShowGpsErrorBar = true
				setTimeout(() => {
					this.isShowGpsErrorBar = false
				}, 5000)
			})
	}

	async mapReady($event) {
		this.map = $event
		this.bounds = new google.maps.LatLngBounds()

		const options: MarkerClustererOptions = {
			imagePath: 'assets/images/marker/marker-public-green',
			zoomOnClick: false,
			gridSize: 50,
			clusterClass: 'cluster',
			imageExtension: 'png'
		};
		this.markerCluster = new MarkerClusterer(this.map, [], options);

		this.map.setCenter({
			lat: this.userPosition.latitude,
			lng: this.userPosition.longitude
		})

		this.updateMap()

		this.properties = this.middleware.lastResult && this.middleware.lastResult.properties
		if (!this.properties || !this.properties.length) {
			this.resizeMap = false
			await this.loadProperties()
		}
		else {
			this.searchAddress = {
				... this.searchAddress,
				...this.middleware.filterCriteria,
				...this.middleware.filterCriteria.coordinates,
				address: this.middleware.filterCriteria.address
			}
			this.buildPropertyList(this.properties)
		}

		this._subscription.add(
			this.middleware.propertyLoaded$
				.subscribe(({ properties }) => {
					this.searchAddress = {
						... this.searchAddress,
						...this.middleware.filterCriteria,
						...this.middleware.filterCriteria.coordinates,
						address: this.middleware.filterCriteria.address
					}
					this.resizeMap = this.middleware.resizeMap
					this.buildPropertyList(properties)
				})
		)

	}

	buildPropertyList(properties) {
		if(this.searchAddress.address && this.searchAddress.address!=''){
			this.markerAddress=this.searchAddress.address
		}
		this.markers.forEach(marker => marker.setMap(null)) // remove all markers

		if (document.getElementById("searchaddress")) {
			document.getElementById("searchaddress").parentElement.classList.add("search-address");
		}

		this.properties = properties && properties.map(prop => ({
			...prop,
			markerIcon: this.getMarkerIcon(prop),
			coordinates: prop.address.coordinates
		}))

		this.markers = this.properties.map(prop => {
			const marker = new google.maps.Marker({
				position: {
					lat: prop.address.coordinates[1],
					lng: prop.address.coordinates[0],
				},
				icon: prop.markerIcon,
				title: prop.propertyId,
				optimized: true
			})

			marker.addListener("click", () => {
				this.selectedProperties = [prop]
			})

			return marker
		})

		this.markerCluster.clearMarkers() // clear all markers before rendering new ones

		this.markerCluster.addMarkers(this.markers)

		google.maps.event.addListener(this.markerCluster, 'clusterclick', (evt: Cluster) => {
			const clusterMarkers = evt.getMarkers()
			this.addPropertySearchDrawer()
			this.selectedProperties = clusterMarkers.map(marker => this.properties.find(prop => prop.propertyId === marker.getTitle()))
		})

		if (this.resizeMap) {
			this.zoomToBounds()
		}

		else {
			if (this.isFlyTo) {
				// set search address on the center of the map
				let gMaplatLng
				if (this.searchAddress.coordinates[0] && this.searchAddress.coordinates[1]) {
					gMaplatLng = new google.maps.LatLng(this.searchAddress.coordinates[1], this.searchAddress.coordinates[0])
				}
				else {
					gMaplatLng = new google.maps.LatLng(-70.000000, 53.000000) //  Quebec province
				}
				this.map && this.map.setCenter(gMaplatLng)
				this.map && this.map.setZoom(12)
				this.map.panTo(this.map.getCenter())
			} else {
				this.map.panTo(this.map.getCenter())
			}
		}

		this.selectedProperties = []
	}

	async loadProperties() {
		try {
			const response = await this.middleware.loadPropertiesOnCurrentMap().toPromise()
			this.searchAddress = {
				... this.searchAddress,
				...this.middleware.filterCriteria,
				...this.middleware.filterCriteria.coordinates,
				address: this.middleware.filterCriteria.address
			}
			this.buildPropertyList(response.properties)			
		}
		catch (err) {
			console.error('Could not get properties on map')
		}
	}

	updateMap() {
		this.mapChangeSubject
			.pipe(
				debounceTime(800)
			)
			.subscribe((data: { event: string, latLngBounds: google.maps.LatLngBounds }) => {
				if (this.mapCriteria) {
					if ((this.mapCriteria.zoom !== this.map.getZoom()) || (+this.map.getCenter().lat().toFixed(5) !== +this.mapCriteria.center.lat.toFixed(5)) ||
						(+this.map.getCenter().lng().toFixed(5) !== +this.mapCriteria.center.lng.toFixed(5))) {
						this.onMapZoomChange(this.map.getZoom())
						this.onMapCenterChange({
							lat: this.map.getCenter().lat(),
							lng: this.map.getCenter().lng()
						})

						if (!this.resizeMap && this.map && this.map.getBounds()) {
							this.middleware.filterCriteria.bounds = {
								north: data.latLngBounds.getNorthEast().lat(),
								east: data.latLngBounds.getNorthEast().lng(),
								south: data.latLngBounds.getSouthWest().lat(),
								west: data.latLngBounds.getSouthWest().lng(),
							}

							// When the user pan the map, clear the search by address
							this.middleware.filterCriteria.placeId = ''
							this.middleware.filterCriteria.address = ''

							this.middleware.setFilterCriteria(this.middleware.filterCriteria)
							this.middleware.saveFilterCriteria()

						}

						this.isFlyTo = false
						this.resizeMap = false

						this.selectedProperties = []

					}
				}
			})
	}

	ngOnDestroy() {
		this._subscription.unsubscribe()
	}

	getMarkerIcon(property) {
		if (property.listingType === 'public') {
			return 'assets/images/marker/marker-public-green.png'
		} else if (property.listingType === 'offMarket') {
			return 'assets/images/marker/marker-offMarket-grey.png'
		} else {
			return 'assets/images/marker/marker-private-black.png'
		}
	}

	addPropertySearchDrawer() {
		setTimeout(() => {
			try {
				window.addEventListener("scroll", this.scrollHandler.bind(this), true);
			}
			catch (err) { }
		}, 1000)

	}

	onPropertySearchDrawerWrapperClosed() {
		document.querySelector('.swiper-button-prev').removeEventListener('click', () => { }, true)
		document.querySelector('.swiper-button-next').removeEventListener('click', () => { }, true)

		this.activeListingDrawer = false
		Object.keys(this.isClicked).forEach(k => this.isClicked[k] = false)
		this.selectedProperties = [];
		this.indexOfPropertyDrawer = 3
		window.removeEventListener("scroll", this.scrollHandler.bind(this), true);
	}

	mapClick() {
		Object.keys(this.isClicked).forEach(k => this.isClicked[k] = false)
		this.activeListingDrawer = false
		this.drawerOutlet.closeDrawers()
	}

	zoomToBounds() {
		let bounds = new google.maps.LatLngBounds()

		if (this.properties && this.properties.length) {
			this.properties.forEach(prop => {
				bounds.extend({
					lat: prop.address.coordinates[1],
					lng: prop.address.coordinates[0]
				})
			})
			if (this.resizeMap) {
				this.bounds = bounds
				this.map.fitBounds(bounds)
			}
		}
		this.map && this.map.setCenter(this.searchAddress.coordinates)
		this.map && this.map.setZoom(15)
	}

	openFilterModal() {
		this.layoutService.openModal(FilterPadComponent)
	}

	onMapCenterChange(center: {
		lat: number,
		lng: number
	}) {
		this.mapCriteria.setCenter(center.lat, center.lng)
		this.middleware.setMapCriteria(this.mapCriteria)
	}

	onMapZoomChange(zoom: number) {
		this.mapCriteria.setZoom(zoom)
		this.middleware.setMapCriteria(this.mapCriteria)
	}

	async resetPosition() {
		this.disableBtn = true
		try {
			await this.geolocationService.getPosition()
			this.resizeMap = true
			this.userPosition = this.geolocationService.position
			this.map.setCenter({
				lat: this.userPosition.latitude,
				lng: this.userPosition.longitude
			})
			const filterCriteria = this.middleware.getCurrentFilterCriteria()
			filterCriteria.placeId = null
			filterCriteria.address = ''
			filterCriteria.coordinates = [this.userPosition.longitude, this.userPosition.latitude]
			filterCriteria.bounds = null
			this.middleware.setFilterCriteria(filterCriteria)
			setTimeout(() => {
				this.disableBtn = false
			}, 400)

			// zoom closer here
			this.map.setZoom(18)
		}
		catch (err) {
			this.checkState()
			this.isShowGpsErrorBar = true
			setTimeout(() => {
				this.isShowGpsErrorBar = false
				this.disableBtn = false
			}, 5000)
		}
	}

	checkState() {
		const message = this.translate.instant('pages.market.market_map.enable_gps')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]

		if (!this.checkStateDlgRef) {
			this.checkStateDlgRef = this.promptService.prompt('', message, promptChoices).pipe(take(1)).subscribe(res => {
				this.checkStateDlgRef = null
				if (res === 'yes') {
					setTimeout(() => {
						const os = this.globalService.getMobileOperatingSystem()
						if (os === 'Android') {
							this.diagnostic.switchToLocationSettings()
						} else {
							this.diagnostic.switchToSettings()
						}
					}, 500)
				}
			})
		}

	}

	clickedMarker(property: PropertyEntity) {
		this.selectedProperties = [property]
		Object.keys(this.isClicked).forEach(k => this.isClicked[k] = false)
		this.isClicked[property.propertyId] = true
		this.addPropertySearchDrawer()
	}

	scrollHandler() {
		const target = document.getElementById('markerList')
		this.propsContent = target

		const fullWidthElements = document.getElementsByClassName('full-width')

		let widthOfUnit = 290

		if (fullWidthElements && fullWidthElements.length) {
			widthOfUnit = fullWidthElements['0'].offsetWidth
		}

		if (target) {
			const offsetWidth = target.offsetWidth
			this.tabsStatesService.save('marketMap', target.scrollLeft)
			if (offsetWidth + target.scrollLeft + widthOfUnit * 2 >= target.scrollWidth && this.indexOfPropertyDrawer < this.selectedProperties.length) {
				this.indexOfPropertyDrawer++
			}
		}

		document.querySelectorAll('.swiper-button-prev').forEach(
			element => {
				element.addEventListener('click', (event) => {
					event.stopPropagation()
				})
			}
		)

		document.querySelectorAll('.swiper-button-next').forEach(
			element => {
				element.addEventListener('click', (event) => {
					event.stopPropagation()
				})
			}
		)
	}

	clearPropList() {
		this.selectedProperties = []
	}

	clickedUserMarker(property: any, infoWindow: any) {
		Object.keys(this.isClicked).forEach(k => this.isClicked[k] = false)
		this.isClicked[property.latitude] = true

		if (this.previousIW) {
			this.currentIW = infoWindow;
			this.previousIW.close();
		}
		this.previousIW = infoWindow;
	}
}
