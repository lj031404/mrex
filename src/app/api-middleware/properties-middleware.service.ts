import { Injectable } from '@angular/core';
import { PropertiesService } from '@app/api_generated';
import {
	HttpClient
} from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'
import { WatchlistService } from '@app/api_generated/api/watchlist.service'
@Injectable({
	providedIn: 'root'
})
export class PropertiesMiddlewareService extends PropertiesService {

	public propsApi: PropertiesService = null;

	constructor(
		http: HttpClient,
		private logger: NGXLogger,
		private watchlistService: WatchlistService
		) {
		super(http, environment.serverUrl, null);
	}

	addProperty(propertyObj: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
		return super.addProperty(propertyObj, observe, reportProgress)
	}

	listUserProperties() {
		return super.getUserProperties()
	}

	getPendingProperties(fetch = false): Observable<any> {
		return this.watchlistService.getPendingWatchlist()
	}
}
