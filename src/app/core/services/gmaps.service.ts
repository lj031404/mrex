import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { MapsAPILoader } from '@agm/core';
import { Observable, Observer } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

declare var google: any;

@Injectable({
	providedIn: 'root'
})
export class GMapsService extends GoogleMapsAPIWrapper {

	constructor(private __loader: MapsAPILoader, private __zone: NgZone, private logger: NGXLogger) {
		super(__loader, __zone);
	}

	getLatLan(address: string): Observable<any> {
		// let geocoder:any;
		// console.log('Getting Address - ', address);

		// if ("maps" in google){
		//     geocoder = new google.maps.Geocoder();
		// } else {
		//     // setTimeout(()=>{
		//     //     this.getLatLan(address);
		//     // },100);
		//     // return false;
		// }



		return Observable.create((observer: any) => {

			try {
				// at this point the variable google may be still undefined (google maps scripts still loading)
				// so load all the scripts, then...
				this.__loader.load().then(() => {
					const geocoder = new google.maps.Geocoder();
					geocoder.geocode({ address }, (results: any, status: any) => {

						if (status === google.maps.GeocoderStatus.OK) {
							const place = results[0].geometry.location;
							observer.next(place);
							observer.complete();
						} else {
							console.error('Error - ', results, ' & Status - ', status);
							if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
								observer.error('Address not found!');
							} else {
								observer.error(status);
							}

							observer.complete();
						}
					});
				});
			} catch (error) {
				observer.error('error getGeocoding' + error);
				observer.complete();
			}



			// geocoder.geocode( { 'address': address}, function(results:any, status:any) {
			//     console.log("All results from geocode - ", results);
			//     if (status === google.maps.GeocoderStatus.OK) {
			//         observer.next(results[0].geometry.location);
			//         observer.complete();
			//     } else {
			//         console.log('Error - ', results, ' & Status - ', status);
			//         observer.next({});
			//         observer.complete();
			//     }
			// });
		})
	}

	getLatLan2() {

	}
}
