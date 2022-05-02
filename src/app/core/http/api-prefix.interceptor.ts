import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { EnvironmentService } from '@app-core/services/environment.service'
/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
	constructor(
		private environmentService: EnvironmentService
	) {}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		/** Replace serverUrl of the current API with selected serverUrl on the API switch modal */
		const newRequest = request.clone({
			url: !request.url.includes('googleapis') ? 
				this.environmentService.environment.serverUrl + '/' + request.url.split('/').splice(4).join('/') : request.url
		})
		return next.handle(newRequest);
	}
}
 