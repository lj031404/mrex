import { BehaviorSubject } from 'rxjs';
import { UsersService } from '@app/api_generated';
import { UserService } from '@app/core/localDB/user.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

export interface Position {
	longitude: number,
	latitude: number
}

let _this

export class GeolocationService {

	options = {
		timeout: 30000,
		maximumAge: 0,
		enableHighAccuracy: true
	}

	position: any
	position$ = new BehaviorSubject<Position|null>(null)
	positionListener

	constructor(
		private geolocation: Geolocation
	) {
		_this = this
	}

	watch() {
		this.positionListener = navigator.geolocation.watchPosition(this.onSuccess, this.onError, this.options)
	}

	public async getPosition_(): Promise<Position> {

		console.log('Get position....')

		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				x => resolve(this.onSuccess(x)),
				x => reject(this.onError(x)),
				this.options)
		})

	}

	public async getPosition(): Promise<Position> {
		console.log('Get position....')
		return new Promise((resolve, reject) => {
			return this.geolocation.getCurrentPosition(this.options)
			.then(res => resolve(this.onSuccess(res)))
			.catch(err => reject(this.onError(err)))
		})
	}

	private onSuccess = function(position: any): Position {
		_this.position = { longitude: position.coords.longitude, latitude: position.coords.latitude }
		_this.position$.next(_this.position)

		/*const log = ('Latitude: '          + position.coords.latitude          + '\n' +
				   'Longitude: '         + position.coords.longitude         + '\n' +
				  'Altitude: '          + position.coords.altitude          + '\n' +
				  'Accuracy: '          + position.coords.accuracy          + '\n' +
				  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
				  'Heading: '           + position.coords.heading           + '\n' +
				  'Speed: '             + position.coords.speed             + '\n' +
				  'Timestamp: '         + position.timestamp                + '\n')//.replace(/\n/g, '<br/>')
		console.log(log)*/
		console.log(`User position: (${_this.position.longitude}, ${_this.position.latitude})`)

		return _this.position
	}

	private onError = function (error): Error {
		const log = ('code: '    + error.code    + '\n' +
				  'message: ' + error.message + '\n')//.replace(/\n/g, '<br/>')
		console.error(log)
		_this.position = { longitude: null, latitude: null }
		_this.position$.next(_this.position)
		return error
	}

	public clearListener(): void {
		navigator.geolocation.clearWatch(this.positionListener)
	}
}
