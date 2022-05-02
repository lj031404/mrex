import { Injectable } from '@angular/core'
import { User, UsersService as UsersApiService } from '@app/api_generated'
import { UserDoc, UserService as UserDBService } from '@app/core/localDB/user.service'
import { AppLanguage } from '@app-models/language.enum'
import { I18nService } from '@app-services/i18n.service'
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserSettingsMiddlewareService {

	user: UserDoc
	public userLanguageSettingEvent:Subject<AppLanguage>=new Subject<AppLanguage>()
	
	isDevStatus:Subject<boolean> = new Subject<boolean>();

	constructor(
		private usersApiService: UsersApiService,
		private userDBService: UserDBService,
		private i18nService: I18nService,
		private router: Router,
		private authenticationService: AuthenticationService
	) {
	}

	get userId() {
		return (this.user as any)._id;
	}

	get email() {
		return this.user.email || ''
	}
	set email(value: string) {
		if (value !== this.user.email) {
			this.save({
				email: value
			})
		}
	}

	get name() {
		return this.user.name || ''
	}

	get phoneNumber() {
		return this.user.phoneNumber || ''
	}

	get street() {
		return this.user.address && this.user.address.street || ''
	}
	set street(value: string) {
		this.save({
			address: {
				...this.user.address || {},
				street: value
			}
		})
	}

	get postalCode() {
		return this.user.address && this.user.address.postalCode || ''
	}
	set postalCode(value: string) {
		this.save({
			address: {
				...this.user.address || {},
				postalCode: value
			}
		})
	}

	get favoriteListings() {
		return this.user.favoriteListings || []
	}
	set favoriteListings(value: string[]) {
		if (!this.favoriteListings) {
			this.favoriteListings = []
		}
		value = [ ...new Set(value) ] // unique set
		this.save({ favoriteListings: value })
	}

	get scopes() {
		return this.user && this.user.scopes
	}

	get language() {
		return this.user && this.user.language === 'fr' ? AppLanguage.French_CA : AppLanguage.English
	}
	set language(lang: AppLanguage) {
		if (lang !== this.language) {
			this.i18nService.language = lang

			this.save({
				language: lang === AppLanguage.English ? 'en' : 'fr'
			}).then(() => {
				this.userLanguageSettingEvent.next(lang)
			})

		}
	}

	get languageCode() {
		return this.user ? this.user.language : 'en'
	}

	get receiveNotification(): boolean {
		return this.user && this.user.notificationsSubscribe === true
	}
	set receiveNotification(notification: boolean) {
		if (notification !== this.user.notificationsSubscribe) {
			this.save({
				notificationsSubscribe: notification
			})
		}
	}

	async sync(): Promise<User> {
		console.info('Synchroninzing user')

		let apiUser: User
		try {
			apiUser = await this.usersApiService.getUser().toPromise()
		}
		catch (err) {
			console.error(err)
			if ([400, 401, 404].includes(err.status)) {
				await this.authenticationService.logout()
				this.router.navigate(['login'], { replaceUrl: true })
				return
			}
		}

		try {
			// the user already exist locally
			this.user = this.userDBService.getUserInfo()
			if (new Date(this.user.updatedAt) > new Date(apiUser.updatedAt)) {
				try {
					await this.usersApiService.updateUser(this.user, this.userId).toPromise()
				}
				catch (e) {}
			}
			else {
				this.user = apiUser
				this.userDBService.save(apiUser)
			}
		}
		catch (err) {
			// no user created yet
			this.user = apiUser
			this.userDBService.save(apiUser)
		}

		this.i18nService.language = this.language

		const updatedUser = this.userDBService.getUserInfo()

		console.info(`User has been synchronized`)

		return Promise.resolve(updatedUser)
	}

	public async save(update: User) {
		update.updatedAt = new Date()
		this.user = this.userDBService.save(update)
		delete update.updatedAt
		await this.usersApiService.updateUser(update, this.user.id).toPromise()
	}

	async isDev(): Promise<boolean> {
		!this.user && await this.sync()
		const roles = this.user && this.user.roles
		if (roles && roles.includes('dev')) {
			this.isDevStatus.next(true)
			return Promise.resolve(true)
		} else {
			this.isDevStatus.next(false)
			return Promise.resolve(false)
		}
	}
}
