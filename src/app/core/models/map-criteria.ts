interface Geocoordinate {
	lat: number
	lng: number
}

export class MapCriteria {
	public center: Geocoordinate
	private initPosition: Geocoordinate
	zoom: number
	distance: number

	constructor(longitude: number, latitude: number) {
		this.initPosition = { lng: longitude, lat: latitude }
		this.reset()
	}

	set(criteria: MapCriteria) {
		this.center = {
			lat: criteria.center.lat,
			lng: criteria.center.lng
		}
		this.zoom = criteria.zoom
		this.distance = criteria.distance
	}

	reset() {
		this.zoom = 13
		this.distance = null
		this.center = { lat: this.initPosition.lat, lng: this.initPosition.lng }
	}

	setCenter(lat: number, lng: number) {
		this.center.lat = lat
		this.center.lng = lng
	}

	setZoom(zoom: number) {
		console.log(zoom)
		this.zoom = zoom
	}

	setDistance(distance: number) {
		this.distance = distance
	}
}
