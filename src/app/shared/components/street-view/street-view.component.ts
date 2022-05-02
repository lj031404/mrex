import { Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, ViewChild } from '@angular/core'
import { MapsAPILoader } from '@agm/core'
import { Observable } from 'rxjs'
import { take, tap } from 'rxjs/operators'

import { Address } from '@app/api_generated'
import { GlobalService } from '@app-services/global.service'

@Component({
	selector: 'app-street-view',
	templateUrl: './street-view.component.html',
	styleUrls: ['./street-view.component.scss']
})
export class StreetViewComponent implements OnInit, OnChanges {

	@ViewChild('streetviewMap', {static: true}) streetviewMap: any
	@ViewChild('streetviewPano', {static: true}) streetviewPano: any
	@Input() address: Address
	@Input() zoom = 11

	streetViewMaxDistance = 100
	latitude = 42.345573
	longitude = -71.098326
	heading = 0
	pitch = 0
	panoId = ''

	initialized = false

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private mapsAPILoader: MapsAPILoader,
		private globalService: GlobalService
	) {
	}

	ngOnInit() {
	}

	async ngOnChanges() {
		
		if (this.address) {
			try {
				await this.getPanoInfo().toPromise()
				this.initializeStreetView()
			} catch (error) {
				this.initializeStreetView()
			}
		} else {
			this.initializeStreetView()
		}
	}

	async initializeStreetView() {
		try {
			await this.mapsAPILoader.load()

			const originalPosition = new window['google'].maps.LatLng(this.address.coordinates[1], this.address.coordinates[0])
			const lookAt = new window['google'].maps.LatLng(this.latitude, this.longitude)
			const streetViewService = new window['google'].maps.StreetViewService()

			streetViewService.getPanoramaByLocation(lookAt, this.streetViewMaxDistance, (streetViewPanoramaData, status) => {
				this.heading = window['google'].maps.geometry.spherical.computeHeading(streetViewPanoramaData.location.latLng, originalPosition)
				const gmap = new window['google'].maps.Map(this.streetviewMap.nativeElement, {
					center: lookAt,
					zoom: this.zoom
				})
				const panorama = new window['google'].maps.StreetViewPanorama(
					this.streetviewPano.nativeElement, {
						position: lookAt,
						pov: {heading: this.heading, pitch: this.pitch}
					})
				gmap.setStreetView(panorama)

				this.initialized = true
			})
		} catch (e) {
		}
	}

	reset() {
		if (!this.initialized) {
			return
		}

		const lookAt = new window['google'].maps.LatLng(this.latitude, this.longitude)
		const gmap = new window['google'].maps.Map(this.streetviewMap.nativeElement, {
			center: lookAt,
			zoom: this.zoom
		})
		const panorama = new window['google'].maps.StreetViewPanorama(
			this.streetviewPano.nativeElement, {
				position: lookAt,
				pov: {heading: this.heading, pitch: this.pitch}
			})
		gmap.setStreetView(panorama)
	}

	getPanoInfo(): Observable<any> {
		return this.globalService.getStreetViewPanoMetaData(this.address.fullAddress).pipe(
			tap((metadata: any) => {
				this.latitude = metadata.location.lat
				this.longitude = metadata.location.lng
				this.panoId = metadata.pano_id
			}),
			// catchError(err => of(null))
		)
	}
}
