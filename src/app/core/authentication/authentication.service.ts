import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser'
import { Router } from '@angular/router';
import { AppStorage } from '@app-services/storage'
import { LokijsService } from '../localDB/lokijs.service';
import { GlobalService } from '../services/global.service';
import { AuthService, NewTokenBody } from '@app/api_generated';

@Injectable()
export class AuthenticationService {

	constructor(
		private lokijs: LokijsService,
		private router: Router,
		private authService: AuthService,
		private globalService: GlobalService) {}

	async createToken(providerToken: string, provider: NewTokenBody.ProviderEnum, providerUserId: string) {
		const res = await this.authService.getJwtToken({ token: providerToken, provider, id: providerUserId }).toPromise()
		this.saveToken(res && res.token || '')
		console.log('New token received from API')
	}

	saveToken(token: string) {
		localStorage.setItem('token', token)
	}

	get token() {
		try {
			return localStorage.getItem('token')
		}
		catch (e) {
			return
		}
	}

	deleteToken() {
		console.log('JWT Token deleted')
		localStorage.removeItem('token')
	}

	get isAuthenticated() {
		return this.user
	}

	get user() {
		try {
			const userStr = localStorage.getItem('user')
			const user = JSON.parse(userStr)

			Sentry.configureScope(function(scope) {
				scope.setUser(user)
			}.bind(this))

			return user
		}
		catch (e) {
			return {}
		}
	}

	deleteUser() {
		console.log('User deleted')
		return localStorage.removeItem('user')
	}

	async logout() {
		this.deleteToken()
		this.deleteUser()
		AppStorage.flush()
		this.lokijs.clear()
		this.globalService.logOutEventListener$.next(false)
		console.log('[AuthenticationService] Logged out')
	}

	logoutAndRedirectToLogin() {
		this.logout()
		this.router.navigate(['/login'])
	}

	saveUser(user: any) {
		localStorage.setItem('user', JSON.stringify(user))
	}

}
