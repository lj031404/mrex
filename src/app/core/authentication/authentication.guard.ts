import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { NGXLogger } from 'ngx-logger'

import { AuthenticationService } from '@app/core/authentication/authentication.service'

@Injectable()
export class AuthenticationGuard implements CanActivate {

	constructor(
		private router: Router,
		private logger: NGXLogger,
		private authenticationService: AuthenticationService
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.authenticationService.isAuthenticated) {
			return true
		}

		console.log('Not authenticated, redirecting and adding redirect url...')
		this.router.navigate(['login'])
		return false
	}

}
