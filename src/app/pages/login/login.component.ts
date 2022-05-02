import { AuthService } from './../../api_generated/api/auth.service';
import { Component, Renderer2, OnInit, HostListener, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { version, branch, hash } from '../../../app/git-version.json'
import { environment } from '@env/environment'
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Platform } from '@ionic/angular'
import { AuthService as SocialAuthService } from 'angularx-social-login'
import { FacebookLoginProvider } from 'angularx-social-login'
import { AuthService as ApiAuthService } from '@app/api_generated/api/auth.service'
import { AuthenticationService } from '@app/core/authentication/authentication.service'
import { I18nService } from '@app/core/services/i18n.service'
import * as Sentry from '@sentry/browser'
import { RouterMap } from '@app/core/utils/router-map.util.js'
import { TranslateService } from '@ngx-translate/core'
import { GlobalService } from '@app/core/services/global.service'
import * as moment from 'moment'
import { SwitchApiDlgComponent } from './switch-api-dlg/switch-api-dlg.component'
import { MatDialog } from '@angular/material'
import { AppInitService } from '@app-core/services/app-init.service'
import { SignInWithApple, ASAuthorizationAppleIDRequest, AppleSignInResponse } from "@ionic-native/sign-in-with-apple/ngx"
import { Location } from '@angular/common'
import { FirebaseUser, FirebaseX } from "@ionic-native/firebase-x/ngx";
import { NewTokenBody, User } from '@app/api_generated';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

	version: string = environment.version
	error: any = ''
	form: FormGroup
	isLoading = false
	isMobile = true
	isLoggedIn = false
	isIOS = false
	user: any
	err: any
	versionStr: string
	passwordType = 'password'

	public log = ''
	clickCount = 0
	startTime

	constructor(
		private fb: Facebook,										// cordova
		private socialAuthService: SocialAuthService, 				// browser
		private apiAuthService: ApiAuthService,
		private deviceService: DeviceDetectorService,
		private authenticationService: AuthenticationService,
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private i18nService: I18nService,
		private renderer: Renderer2,
		private translate: TranslateService,
		private globalService: GlobalService,
		public dialog: MatDialog,
		private appInit: AppInitService,
		public translateService: TranslateService,
		private signInWithApple: SignInWithApple,
		private platform: Platform,
		private location: Location,
		public authService: AuthService,
		private firebase: FirebaseX
	) {
	}

	async ngOnInit() {
		try {

			this.renderer.removeClass(document.body, 'fixed-navbar')

			this.isMobile = this.deviceService.isMobile()
			this.isIOS = this.platform.is('ios')

			this.globalService.logOutEventListener$.next(true)

			this.form = this.formBuilder.group({
				username: ['', Validators.required],
				password: ['', Validators.required],
				remember: true
			})

			this.versionStr = `${version} (${branch}/#${hash.substr(-6)})`

			await this.apiAuthService.validateJwtToken({ token: this.authenticationService.token }).toPromise()
			console.log('User is already logged in')
			await this.onLoggedInSuccess()

		}
		catch (err) {
			console.log('User is not logged in')
			Sentry.captureException(`[login.component: ngOnInit] Error : ${JSON.stringify(err)}`)
			this.isLoading = false
			this.isLoggedIn = false
			await this.authenticationService.logout()
		}
	}

	get currentLanguage(): string {
		return this.i18nService.language
	}

	get languages(): string[] {
		return this.i18nService.supportedLanguages
	}

	@HostListener('click') onClick() {
		this.clickCount++
		if (this.clickCount === 1) {
			this.startTime = moment()
		}
		if (this.clickCount > 9) {
			const currentTime = moment()
			const durationSeconds = moment.duration(currentTime.diff(this.startTime)).asSeconds()

			if (durationSeconds < 10) {
				this.openSwitchModal()
			}
		}
	}

	async fbLogin() {

		this.isLoading = true
		this.error = ''

		try {
			// cordova
			try {
				if (this.isMobile) {
					const res: FacebookLoginResponse = await this.fb.login(['public_profile', 'email'])
					console.log('FacebookLoginResponse : ' + JSON.stringify(res))
					if (res.status === 'connected') {
						await this.onFacebookConnected(res)
					}
					else {
						this.isLoading = false
						this.error =  this.translate.instant('page.login.defaultError')
					}
				}
				// browser
				else {
					const user = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
					await this.prepareAndLogin(user.id, NewTokenBody.ProviderEnum.Facebook, user.authToken, user)
				}
			}
			catch (err) {
				console.error(err)

				// FB Error Code: User cancelled dialog
				if (err && err.errorCode === '4201') {
					this.error = ''
				}
				else {
					// Error from MREX API
					if (err && err.error && err.status >= 400) {
						try {
							this.error = this.translateService.instant(err.error.code)
						} catch (error) {
							this.error = this.translateService.instant('error.genericMessage')
						}
					}

					// Unknown error
					else {
						this.error = this.translate.instant('page.login.defaultError')
					}

					// Report the error to Sentry
					const errMsg = `FB Login Error: ${JSON.stringify(err)}`
					Sentry.captureException(errMsg)
					console.error(errMsg)
				}

				await this.authenticationService.logout()

				this.isLoading = false
				this.isLoggedIn = false
			}
		}
		catch (err) {
			const errMessage = `[fbLogin] Error: ${err}`
			this.error = errMessage
			Sentry.captureException(errMessage)
		}
	}

	async onFacebookConnected(res: FacebookLoginResponse) {
		console.log('Connected to Facebook : ' + JSON.stringify(res))

		try {
			const facebookUser = await this.fb.api('/' + res.authResponse.userID + '/?fields=id,email,name,picture,first_name,last_name', ['public_profile'])
			const user: User = {
				id: facebookUser.id,
				email: facebookUser.email,
				name: facebookUser.name,
				firstname: facebookUser.first_name,
				lastname: facebookUser.last_name,
				photoUrl: facebookUser.picture.data.url
			}
			await this.prepareAndLogin(facebookUser.id, NewTokenBody.ProviderEnum.Facebook, res.authResponse.accessToken, user)
		}
		catch (err) {
			console.error(err)
			const errMessage = `[Facebook Signin] Error: ${err && err.error}`
			this.error = errMessage
			Sentry.captureException(`[login.component: onFacebookConnected] Error: ${JSON.stringify(err)}`)
			this.isLoading = false
		}

	}

	async appleLogin() {
		try {
			this.isLoading = true
			this.error = ''

			const appleSigninResponse = await this.signInWithApple.signin({
				requestedScopes: [
					ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
					ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail,
				]
			})

			const user: User = {
				firstname: appleSigninResponse.fullName.givenName,
				lastname: appleSigninResponse.fullName.familyName,
				email: appleSigninResponse.email
			}

			await this.prepareAndLogin(appleSigninResponse.user, NewTokenBody.ProviderEnum.Apple, appleSigninResponse.authorizationCode, user)

		}
		catch (err) {
			console.error(err)
			const errMessage = `[appleLogin] Error: ${err && err.error}`
			this.error = errMessage
			Sentry.captureException(`[login.component: appleLogin] Error: ${JSON.stringify(err)}`)
			this.isLoading = false
		}

	}

	async googleSignIn() {
		this.isLoading = true
		this.error = ''

		try {
			console.log(JSON.stringify(environment.firebase))
			const result = await this.firebase.authenticateUserWithGoogle(environment.firebase.clientId)

			await this.firebase.signInWithCredential(result)

			const firebaseUser = await this.firebase.getCurrentUser() as FirebaseUser

			const user: User = {
				name: firebaseUser.name,
				email: firebaseUser.email
			}

			await this.prepareAndLogin(firebaseUser.uid, NewTokenBody.ProviderEnum.Google, firebaseUser.idToken, user)

		}
		catch (err) {
			console.log(JSON.stringify(environment))
			console.error(err)
			const errMessage = `[googleSignIn] Error: ${err && err.error || err}`
			this.error = errMessage
			Sentry.captureException(`[login.component: googleSignIn] Error: ${JSON.stringify(err)}`)
			this.isLoading = false
		}
	}

	async prepareAndLogin(providerUserId: string, provider: NewTokenBody.ProviderEnum, providerToken: string, user: User) {
		try {
			// get a jwt token
			await this.authenticationService.createToken(providerToken, provider, providerUserId)
			await this.onLoggedInSuccess()
		}
		// user not found on API: let's create it
		catch (err) {
			console.error(err)
			console.log(`User doesn't exist on API`)

			// the user has never been created
			this.isLoading = false
			if (err.status === 404) {
				this.isLoading = false
				const data = { user, providerUserId, isFrom: provider, providerToken }
				const queryParams = { data: JSON.stringify(data) }
				return this.router.navigate([RouterMap.OAuthSignup.path], { queryParams, replaceUrl: true })
			}
			else {
				throw `Cannot create user on MREX API. Error: ${JSON.stringify(err)}`
			}
		}
	}

	async onLoggedInSuccess() {

		this.authenticationService.saveUser(this.user)

		this.isLoading = false
		this.isLoggedIn = true
		this.location.replaceState('/'); // clears browser history so user can't navigate with back button

		await this.router.navigate([this.route.snapshot.queryParams.redirect || RouterMap.Home.path], { replaceUrl: true })

	}

	setLanguage(language: string) {
		this.i18nService.language = language
	}

	async login() {
		if (this.isLoading) {
			return
		}

		try {
			this.isLoading = true
			this.error = ''
			const { username, password } = this.form.getRawValue()
			this.apiAuthService.configuration.username = username.toLowerCase()
			this.apiAuthService.configuration.password = password.toLowerCase()
			const { token } =  await this.apiAuthService.authPost().toPromise()
			this.authenticationService.saveToken(token)
			await this.onLoggedInSuccess()
		}
		catch (err) {
			console.error(err)
			if (err && err.error && err.status >= 400) {
				try {
					this.error = this.translateService.instant(err.error.code)
				} catch (error) {
					this.error = this.translateService.instant('error.genericMessage')
				}
			}
			this.isLoading = false
			this.form.reset()
		}

	}

	async signup() {
		if (!this.isLoading) {
			this.router.navigate([RouterMap.Signup.path], { queryParams: { step: 1 } })
		}
	}

	async forgot() {
		if (!this.isLoading) {
			this.router.navigate([RouterMap.PasswordForgot.path], { queryParams: { step: 1 } })
		}
	}

	async openSwitchModal() {
		this.clickCount = 0
		const res = await this.dialog.open(SwitchApiDlgComponent, {
			disableClose: true,
			panelClass: 'switch-apl-dlg'
		}).afterClosed().toPromise()
		this.clickCount = 0
		if (res) {
			await this.authenticationService.logout()
			await this.appInit.loadConfiguration(res).toPromise()
		}
	}

	passwordShow(type: string) {
		this.passwordType = type
	}

	gotoPrivacyPolicy() {
		if (!this.isLoading) {
			this.router.navigate([RouterMap.Settings.PRIVACY])
		}
	}

	ngOnDestroy() {
		this.renderer.addClass(document.body, 'fixed-navbar')
	}

}
