import { Injectable } from '@angular/core'
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpResponse
} from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { NGXLogger } from 'ngx-logger'

import { AuthenticationService } from './authentication.service'
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class OauthInterceptService implements HttpInterceptor {

	constructor(private authenticationService: AuthenticationService,
		private router: Router) { }

	// intercept request and add token
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		// do not intercept Basic Auth requests
		if (request.method === 'POST' && (request.url.includes('auth') || request.url.includes('signup'))) {
			return next.handle(request)
		}

		if (request.method === 'GET' && request.url.includes('verificationCode')) {
			return next.handle(request)
		}
		// modify request
		const token = this.authenticationService.token

		// added exception to prevent the redirecting issue from password forgot page.
		if (!token && !this.router.url.includes('/forgot')) {
			this.authenticationService.logout()
				.then(() => {
					this.router.navigate(['/login'], { replaceUrl: true })
				})
		}

		if (!request.url.startsWith('https://maps.googleapis.com')) {
			request = request.clone({
				setHeaders: {
					'x-auth-token': `${token}`
				}
			})
		}

		return next.handle(request)
			.pipe(
				tap(event => {
					if (event instanceof HttpResponse) {
						// http response status code
						return event
					}
				}),
				catchError((err) => {
					if (err.status === 401) {
						this.authenticationService.logout()
						this.router.navigate(['/login'], { replaceUrl: true })
					}
					return throwError(err)
				})
			)

	}
}
