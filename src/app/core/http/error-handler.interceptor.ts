import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { NGXLogger } from 'ngx-logger'
import * as Sentry from '@sentry/browser';

/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

	constructor() { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
	}

	// Customize the default error handler here if needed
	private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
		if (environment.production) {
			// Do something with the error
			console.error('Request error', response)
			if ((response as any).status >= 500) {
				const error = `Server side error (status: ${(response as any).status}). ${JSON.stringify((response as any).error)}`
				Sentry.captureException(error)
			}
		}
		throw response;
	}

}
