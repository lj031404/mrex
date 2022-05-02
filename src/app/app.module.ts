import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injectable, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';

import { ServiceWorkerModule } from '@angular/service-worker';
import { Angulartics2Module } from 'angulartics2';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Facebook } from '@ionic-native/facebook/ngx';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { GaugeModule } from 'angular-gauge';
import { AgmCoreModule } from '@agm/core';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core/core.module';
import { LayoutModule } from '@app/layout/layout.module';
import { OauthInterceptService } from '@app/core/authentication/oauth-intercept.service';
import { GMapsService } from './core/services/gmaps.service';
import { ApiModule, Configuration } from './api_generated';
import { UserSettingsMiddlewareService } from './api-middleware/user-settings-middleware.service';

import { UserModule } from './pages/user/user.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DatePipe } from '@angular/common';
import { SyncService } from './core/services/sync.service';
import { EnvironmentService } from './core/services/environment.service'
import { AppInitService } from './core/services/app-init.service'

import { SharedModule } from './shared/shared.module';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ConfirmationModule } from '@app/shared/components/confirmation/confirmation.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { MarketModule } from '@app-pages/market/market.module';
import { version, branch, hash } from '../app/git-version.json'

import * as Sentry from '@sentry/browser';

import { SearchComponent } from './pages/search/search.component';
import { GeolocationService } from './shared/services/geolocation.service';
import { CalculatorService } from './shared/services/calculator.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { AngularFireMessagingModule } from '@angular/fire/messaging'
import { AngularFireModule } from '@angular/fire'
import { CacheAppRouteReuseStrategy } from './cache-app-route-reuse.strategy'
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { UserProfileModule } from './shared/components/user-profile/user-profile.module';
import { FcmProvider } from './shared/providers/push-notifications';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { LokijsService } from './core/localDB/lokijs.service';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';


// Sentry setup
// https://nils-mehlhorn.de/posts/angular-error-tracking-with-sentry
@Injectable()
export class SentryErrorHandler implements ErrorHandler {
	constructor(
	) {
		Sentry.init({
			dsn: 'https://8e1256570afd46ae9d9fa8571c623e30@sentry.io/5058427',
			release: `${branch}-${version}`,
			environment: environment.production ? 'prod' : 'dev'
		})
		Sentry.withScope(scope => {
			scope.setTag('commit', hash)
		})
	}
	handleError(error) {
		const eventId = Sentry.captureException(error.originalError || error)
		console.error(error)
		// TODO: implement a user dialog to report the errors? Sentry dialog is not good
		// Sentry.showReportDialog({ eventId })
	}
}
export function getErrorHandler(): ErrorHandler {
	if (environment.production) {
		return new SentryErrorHandler()
	}
	return new ErrorHandler()
}


const authServiceConfig = new AuthServiceConfig([
	/*{
	  id: GoogleLoginProvider.PROVIDER_ID,
	  provider: new GoogleLoginProvider("Google-OAuth-Client-Id")
	},*/
	{
		id: FacebookLoginProvider.PROVIDER_ID,
		provider: new FacebookLoginProvider(environment.facebook.appId)
	}
]);

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
	direction: 'horizontal',
	slidesPerView: 'auto'
};

const NGX_MASK_OPTIONS: Partial<IConfig> | (() => Partial<IConfig>) = {};

export function apiConfigFactory(): Configuration {
	return new Configuration({
		basePath: environment.serverUrl,
		withCredentials: true
	});
}

export function authProvideConfig() {
	return authServiceConfig;
}

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
		HttpClientModule,
		TranslateModule.forRoot(),
		NgbModule,
		LoggerModule.forRoot({
			// serverLoggingUrl: '/api/logs',
			level: NgxLoggerLevel.DEBUG,
			// enableSourceMaps: true,
			serverLogLevel: NgxLoggerLevel.ERROR
		}),

		SocialLoginModule,
		DeviceDetectorModule.forRoot(),
		Angulartics2Module.forRoot(),
		GaugeModule.forRoot(),

		CoreModule,
		LayoutModule.forRoot(),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyCUKj24F9NwpRI-Z1pA-zN3c8xzwsGnup0',
			libraries: ['places']
		}),
		ApiModule.forRoot(apiConfigFactory),
		AppRoutingModule,
		UserModule,
		SharedModule,
		SwiperModule,
		NgxMaskModule.forRoot(NGX_MASK_OPTIONS),
		ConfirmationModule,
		ButtonsModule,
		MarketModule,
		IonicModule.forRoot(),
		UserProfileModule,
		AngularFireMessagingModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireModule,
		UserProfileModule
	],
	declarations: [AppComponent, SearchComponent],
	providers: [
		SignInWithApple,
		Geolocation,
		SocialSharing,
		Diagnostic,
		LokijsService,
		OauthInterceptService,
		GMapsService,
		DatePipe,
		UserSettingsMiddlewareService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: OauthInterceptService,
			multi: true
		},
		{
			provide: AuthServiceConfig,
			useFactory: authProvideConfig
		},
		Facebook,
		SyncService,
		EnvironmentService,
		{
			provide: SWIPER_CONFIG,
			useValue: DEFAULT_SWIPER_CONFIG
		},
		{
			provide: ErrorHandler,
			useFactory: getErrorHandler
		},
		AmChartsService,
		GeolocationService,
		CalculatorService,
		YoutubeVideoPlayer,
		StatusBar,
		InAppBrowser,
		AppInitService,
		{
			provide: APP_INITIALIZER,
			useFactory: (appInitService: AppInitService) => () => appInitService.loadConfiguration(localStorage.getItem('apiServer') ? localStorage.getItem('apiServer') : environment.name).toPromise(),
			deps: [AppInitService],
			multi: true
		},
		{
			provide: RouteReuseStrategy,
			useClass: CacheAppRouteReuseStrategy,
		},
		FirebaseX,
		FcmProvider,
		SplashScreen,
		Keyboard,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
