import { Component, OnInit, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MouseEvent } from '@agm/core';
import { NGXLogger } from 'ngx-logger'
import { ModelProperty } from '@app/api_generated';
import { PropertiesService } from '@app/core/localDB/properties.service';
import { GMapsService } from '@app/core/services/gmaps.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs-compat/Observable';

@Component({
	selector: 'app-agm-map',
	templateUrl: './agm-map.component.html',
	styleUrls: ['./agm-map.component.scss']
})
export class AgmMapComponent implements OnInit {
	@Input() inputDocumentId: string = null
	@Input() propertyData$: Observable<ModelProperty>
	@Input() zoomControlOptions: any
	@Input() streetViewControl = true

	lat = 0
	lng = 0

	marker: any = {
		lat: null,
		lng: null
	}

	zoom = 13

	isLoading = false
	documentId: string = null
	propertyData: ModelProperty = null

	constructor(
		private localDBProp: PropertiesService,
		public gmapService: GMapsService,
		private __zone: NgZone,
		private logger: NGXLogger,
		private changeDetectorRef: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.propertyData$.subscribe(async (propertyData) => {
			if (propertyData) {
				this.propertyData = propertyData
				await this.getPropertyCoords().toPromise()
				this.changeDetectorRef.markForCheck()
			}
		})
	}

	async loadProperty(): Promise<any> {

		try {
			this.isLoading = true
			const res = await this.localDBProp.getPropertyByDocId(this.documentId)
			this.propertyData = res.propertyData

			if (this.propertyData.address && this.propertyData.address.coordinates.coordinates.length > 0) {
				this.lat = this.propertyData.address.coordinates.coordinates[0]
				this.lng = this.propertyData.address.coordinates.coordinates[1]
			}

			return this.getPropertyCoords().toPromise()
		}
		catch (err) {
			console.error(err)
			this.isLoading = false
		}

	}

	getPropertyCoords(): Observable<any> {
		this.isLoading = false

		let searchQuery = '';
		if (this.propertyData.address && this.propertyData.address.civicNumber && this.propertyData.address.street) {
			searchQuery += this.propertyData.address.civicNumber
			searchQuery += ' '
			searchQuery += this.propertyData.address.street

			searchQuery += ' '
			searchQuery += this.propertyData.address.city
			searchQuery += ' '
			searchQuery += this.propertyData.address.state

			searchQuery += ' '
			searchQuery += this.propertyData.address.postalCode
		}
		console.log('About to search for this - ', searchQuery, this.propertyData)

		return this.gmapService.getLatLan(searchQuery)
			.pipe(
				map((result: any) => {
						this.__zone.run(() => {
							this.lat = result.lat()
							this.lng = result.lng()

							this.marker.lat = this.lat
							this.marker.lng = this.lng
							console.log('This lat and lng- ', this.lat, this.lng)
						})
					}
				)
			)
	}

	clickedMarker() {
		console.log('clicked the marker:')
	}

	mapClicked($event: MouseEvent) {
		console.log('Map was clicked', $event)
	}
}
