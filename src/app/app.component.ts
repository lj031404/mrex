import { Component, OnInit, OnDestroy, ViewContainerRef, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Location } from '@angular/common';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { environment } from '@env/environment';
import { I18nService } from '@app/core/services/i18n.service';
import { LayoutService } from '@app/layout/service/layout.service';
import { AuthenticationService } from './core/authentication/authentication.service';
import { Renderer2 } from '@angular/core';
import { CordovaEvent } from '@app-models/cordovaEvent.enum';
import { CordovaEventService } from '@app-services/cordova-event.service';
import { RouterMap } from './core/utils/router-map.util';
import { PromptService } from './shared/services/prompt.service';
import { EnvironmentService } from './core/services/environment.service';
import { Platform } from '@ionic/angular';
import { _translate } from './core/utils/translate.util';
import { MenuItem } from './core/models/menu.interface';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SyncService } from './core/services/sync.service';
import { MarketMiddlewareService } from './api-middleware/market-middleware.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	text: string
	environment
	lastRoute

	menuItems: MenuItem[] = [
		// Add a comment: "Disabled for v2"
		// {
		// 	scope: 'college',
		// 	name: _translate('layout.page-layout.college'),
		// 	iconName: 'college',
		// 	link: RouterMap.College.url([])
		// },
		{
			scope: 'videos',
			name: _translate('layout.page-layout.mrex_content'),
			iconName: 'mrex_content',
			link: RouterMap.Videos.url([])
		},
		{
			scope: 'subscription',
			name: _translate('layout.page-layout.subscription'),
			iconName: 'subscription',
			link: RouterMap.Subscription.url([])
		},
		/*{
			scope: 'investor',
			name: _translate('layout.page-layout.investor'),
			iconName: 'event_note',
			link: RouterMap.InvestorProfile.url()
		},  */
		{
			scope: 'settings',
			name: _translate('layout.page-layout.settings'),
			iconName: 'settings',
			link: RouterMap.Settings.url([])
		},
		/*{
			scope: 'help',
			name: _translate('layout.page-layout.help'),
			iconName: 'help_outline'
		}*/
	]

	user: any;

	constructor(
		// do not remove the analytics injection, even if the call in ngOnInit() is removed
		// this injection initializes page tracking through the router
		private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
		private i18nService: I18nService,
		private layoutService: LayoutService,
		private vcr: ViewContainerRef,
		public authenticationService: AuthenticationService,
		private router: Router,
		private renderer: Renderer2,
		private cordovaEventService: CordovaEventService,
		private location: Location,
		public promptService: PromptService,
		private environmentService: EnvironmentService,
		// private fcm: FCM, 
		public platform: Platform,
		private userSettingsMiddlewareService: UserSettingsMiddlewareService,
		private splashScreen: SplashScreen,
		public syncService: SyncService,
		private marketMiddleWare: MarketMiddlewareService,
		private keyboard: Keyboard,
	) {
		this.environment = this.environmentService.environment
		this.platform.ready()
			.then((platform) => {
				if (this.platform.is('cordova')) {
					this.splashScreen.hide()
				}

				this.renderer.listen('document', 'backbutton', e => {
					if (!this.layoutService.modalRefList.length && !window.history.state.modal) {
						this.location.back()
					}
					this.cordovaEventService.sendEvent(CordovaEvent.BackButton)

					e.preventDefault()
					e.stopPropagation()
					return false
				})

				this.renderer.listen('document', 'keypress', e => {
					if (e && e.keyCode === 13) {
						this.keyboard.hide();
					}
				})

				this.setUpTranslations()

				// reset market filter criteria
				this.marketMiddleWare.resetFilters()
				this.marketMiddleWare.resetMapCriteria()

				this.angulartics2GoogleAnalytics.startTracking()
				this.angulartics2GoogleAnalytics.eventTrack(this.environment.version, { category: 'App initialized' })

				if (localStorage.getItem('server') && localStorage.getItem('server') !== this.environment.serverUrl) {
					console.log('Server URL has changed! Redirect to login')
					this.authenticationService.logoutAndRedirectToLogin()
				}
				localStorage.setItem('server', this.environment.serverUrl)

				this.layoutService.initMenu()

				const scopes = this.userSettingsMiddlewareService.user
					&& this.userSettingsMiddlewareService.user.scopes

				const roles = this.userSettingsMiddlewareService.user && this.userSettingsMiddlewareService.user.roles
				if (roles && roles.includes('dev') || environment.dev) {
					console.warn(`User is a developer, all features are enabled!`)
				}
				else if (scopes) {
					this.menuItems = this.menuItems.filter(m => scopes.includes(m.scope))
				}
			})

		this.user = this.authenticationService.user

	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.i18nService.destroy()
	}

	setUpTranslations() {
		this.i18nService.init(this.environment.defaultLanguage, this.environment.supportedLanguages)
	}

	prepareRouteAnimation(outlet: RouterOutlet) {
		return
		// Uncomment to establish transition (but transition are causing other bog as elements in the DOM takes time to appear)
		/*
		if (!outlet.isActivated) {
			return ''
		}

		let route = outlet.activatedRoute
		while (route.children.length) {
			route = route.firstChild
		}
		return route*/
	}

	get enableFooter() {
		const url = this.router.url

		if (url.includes(RouterMap.Signin.path) ||
			url.includes(RouterMap.Signup.path)
		) {
			return false
		}

		if (url.includes(RouterMap.Videos.url([RouterMap.Videos.all])) ||
			url.includes(RouterMap.Videos.url([RouterMap.Videos.playlist]))
		) {
			return true
		}

		if (url.includes(`${RouterMap.Articles.path}/`) ||
			url.includes(`${RouterMap.Videos.path}/`) ||
			url.includes(`${RouterMap.Video.path}/`) ||
			url.includes(`${RouterMap.Watchlist.COMPARE}/`)) {
			return false
		}

		return true
	}

	@HostListener('window:offline')
	setNetworkOffline(): void {
		if (this.syncService.isOnline$.value) {
			this.layoutService.openSnackBar(_translate('literals.no_internet_connection'), null, 10000000, 'warning')
		}
		this.syncService.isOnline$.next(false)
	}

	@HostListener('window:online')
	setNetworkOnline(): void {
		this.syncService.isOnline$.next(true)
		this.layoutService.snackBarRef && this.layoutService.snackBarRef.dismiss()
	}
}
