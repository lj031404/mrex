import { Injectable } from "@angular/core";
import { Platform } from '@ionic/angular';
import { AuthService } from '@app/api_generated';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { filter, map, tap } from "rxjs/operators";
import { Router, UrlSerializer } from '@angular/router'
import { RouterMap } from "@app/core/utils/router-map.util";
import { LayoutService } from "@app/layout/service/layout.service";

@Injectable()
export class FcmProvider {
	token: string
	messageChannel: MessageChannel 	// Service worker communication
	route							// route to go at initialization
	message$ = new Subject()

	constructor(
		private firebase: FirebaseX, 						// mobile
		private platform: Platform,
		private authService: AuthService,
		private angularFireMessaging: AngularFireMessaging, // web
		private router: Router,
		private serializer: UrlSerializer,
		private layoutService: LayoutService
	) {
		this.messageChannel = new MessageChannel()
	}

	async initServiceWorker() {
		console.log('Init service worker')

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistrations().then(function (serviceWorkerRegistration) {
				if (serviceWorkerRegistration && serviceWorkerRegistration.length) {
					const worker = serviceWorkerRegistration[0].active

					// Send data to service worker
					// First we initialize the channel by sending
					// the port to the Service Worker (this also
					// transfers the ownership of the port)
					worker.postMessage({
						type: 'INIT_PORT',
					}, [this.messageChannel.port2]);
				}
			}.bind(this)).catch(err => console.error())
		}
		else {
			console.error('No service worker in navigator? Wait, then retry in 1 second')
			setTimeout(() => this.initServiceWorker(), 1000)
		}
	}

	async initPushNotifications() {
		try {

			this.initServiceWorker()

			this.messageChannel.port1.onmessage = (event) => {
				this.message$.next(event)
			}

			this.listenToNotifications().subscribe()
		}
		catch (err) {
			console.error(err)
			this.layoutService.openSnackBar('You won \'t be able to receive notifications' + JSON.stringify(err), null, 5000, 'error')
		}
	}

	public async getPushToken(): Promise<string> {
		try {
			if (this.platform.is('cordova')) {
				this.token = await this.firebase.getToken()

				const hasPermission = await this.firebase.hasPermission()
				if (!hasPermission) {
					console.warn('No permission to receive push notifications. Prompt user to grant permission')

					// on IOS, the push notification permision is false, we must prompt
					try {
						await this.firebase.grantPermission()
						console.log('Push Notification: Permission granted')
					}
					catch (err) {
						console.error(`Couldn't grant permission to Push Notification! : ${err}`)
					}
				}

				this.token = await this.firebase.getToken()

				this.firebase.onTokenRefresh().subscribe(token => {
					this.token = token
					this.saveTokenToServer()
				})
			}

			// browser
			else {
				this.token = await this.requestPermission()
			}

			console.log('Push Notification Token', this.token)

			return this.token

		}
		catch (err) {
			console.error(err)
		}
	}

	public async saveTokenToServer() {
		if (!this.token) {
			console.error('No push token! Nothing to save to server!')
			return
		}

		try {
			await this.authService.updatePushNotificationToken({ token: this.token }).toPromise()
		}
		catch (err) {
			console.error(`Could not save push token to server : ${JSON.stringify(err)}`)
		}

	}

	listenToNotifications(): Observable<any> {
		// for Android and IOS only
		if (this.platform.is('cordova')) {
			return this.onMobileNotification()
		}
		// browser
		else {
			return this.onWebNotifications()
		}
	}

	onPushNotification(type, params) {
		let queryParams: any = {}
		let tree

		const { id } = params

		switch (type) {
			case 'newArticle':
				queryParams.articleId = id
				tree = this.router.createUrlTree([RouterMap.Home.path], { queryParams })
				this.route = this.serializer.serialize(tree)
				this.router.navigateByUrl(this.route)
				break
			case 'newVideo':
				queryParams.videoId = id
				tree = this.router.createUrlTree([RouterMap.Home.path], { queryParams })
				this.route = this.serializer.serialize(tree)
				this.router.navigateByUrl(this.route)
				break
			default:
				break
		}

	}

	// **************** Web APP ******************
	async requestPermission(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.angularFireMessaging.requestToken.subscribe(token => {
				resolve(token)
			}, err => {
				reject(err)
			})
		})
	}

	onWebNotifications(): Observable<{}> {
		const foregroundMessages = this.angularFireMessaging.messages
			.pipe(
				tap((event: any) => {
					console.log('Received in foreground', event)
					this.onPushNotification(event.data.type, event.data)

					// show a toast that there is a new article? Or a pill ?	
					// do something
				})
			)

		const backgroundMessages = this.message$
			.pipe(
				filter((event: any) => event.data),
				map((event: any) => {
					console.log(event)
					return event.data
				}),
				tap((event: any) => {
					console.log('Received in background', event)
					this.onPushNotification(event.data.type, event.data)

					// show a toast that there is a new article? Or a pill ?	
					// do something...
				})
			)

		return merge(foregroundMessages, backgroundMessages)
	}

	onMobileNotification(): Observable<{}> {
		const foregroundMessages = this.firebase.onMessageReceived()
			.pipe(
				tap((event: any) => {
					console.log('Received in foreground', event)
					let id = '';
						if(event.type == "newVideo")
						{
							id =event.videoId;
						}
						else{
							id =event.articleId;
						}
					this.onPushNotification(event.type, { id })

					// show a toast that there is a new article? Or a pill ?	
					// do something
				})
			)

		const backgroundMessages = fromEvent(this.messageChannel.port1, 'onmessage')
			.pipe(
				tap((event: any) => {
					console.log('Received in background', event)
					let id = '';
						if(event.type == "newVideo")
						{
							id =event.videoId;
						}
						else{
							id =event.articleId;
						}						
							this.onPushNotification(event.type, { id })

					// show a toast that there is a new article? Or a pill ?	
					// do something
				})
			)

		return merge(foregroundMessages, backgroundMessages)
	}

}
