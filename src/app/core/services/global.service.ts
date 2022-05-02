import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

import { Howl } from 'howler'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PortfolioPropertyAction } from '@app-models/portfolioEvent.enum';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {

	compareTarget1: any = null;
	compareTarget2: any = null;

	handleBack: EventEmitter<any> = new EventEmitter();
	handleForward: EventEmitter<any> = new EventEmitter();

	propertiesReceived: EventEmitter<any> = new EventEmitter();
	localPropertiesDeleted: EventEmitter<any> = new EventEmitter();
	localPropertiesInserted: EventEmitter<any> = new EventEmitter();
	syncEvent: EventEmitter<any> = new EventEmitter();

	logOutEventListener$ = new BehaviorSubject<boolean>(true)

	temporaryOfflineIdPrefix = 'temp_';

	private _version: string

	get version() {
		return this._version || '1.0.0'
	}
	set version(v: string) {
		this._version = v
	}

	private listeningCreatePortfolioProp:Subject<PortfolioPropertyAction>=new Subject<PortfolioPropertyAction>();
	portfolioEvent:Observable<PortfolioPropertyAction>=this.listeningCreatePortfolioProp.asObservable();
  
	public menuClicked$ = new BehaviorSubject<{
		key: string,
		href: string
	}>({
		key: '',
		href: ''
	})
	sound

	constructor(
		private http: HttpClient
	) {
		// this.remoteSync();
	}

	public goBack() {
		this.handleBack.emit();
	}

	public goForward() {
		this.handleForward.emit();
	}

	public getStreetViewPanoMetaData(address: string) {
		return this.http.request('get', 'https://maps.googleapis.com/maps/api/streetview/metadata', {
			headers: new HttpHeaders().set('sec-fetch-dest', 'document'),
			responseType: 'json',
			params: {
				size: '400x400',
				location: address,
				key: environment.google.apiKey
			}
		})
	}

	playSound(audio: string) {
		this.sound = new Howl({
			src: ['assets/audio/' + audio + '.mp3']
		})
		this.sound.play()
	}

	stopSound() {
		this.sound.stop()
	}

	/**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or the platform.
     *
     * @returns {String}
     */
	getMobileOperatingSystem() {
		let userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

		// Windows Phone must come first because its UA also contains "Android"
		if (/windows phone/i.test(userAgent)) {
			return 'Windows Phone';
		}

		if (/android/i.test(userAgent)) {
			return 'Android';
		}

		// iOS detection from: http://stackoverflow.com/a/9039885/177710
		if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
			return 'iOS';
		}

		return (navigator as any).platform;
	}

	getDeviceInfo() {
		const os = this.getMobileOperatingSystem()
		const device = this.getDeviceType()
		const { browser, release } = this.getBrowserInfo()

		return {
			browser,
			device,
			os,
			release,
			userAgent: navigator.userAgent
		}
	}

	getDeviceType() {
		const ua = navigator.userAgent;
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		  return "tablet";
		}
		if (
		  /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
			ua
		  )
		) {
		  return "mobile";
		}
		return "desktop";
	}

	getBrowserInfo() {
		var navUserAgent = navigator.userAgent;
		var browserName  = navigator.appName;
		var browserVersion  = ''+parseFloat(navigator.appVersion); 
		var majorVersion = parseInt(navigator.appVersion,10);
		var tempNameOffset,tempVersionOffset,tempVersion;
		
		
		if ((tempVersionOffset=navUserAgent.indexOf("Opera"))!=-1) {
		 browserName = "Opera";
		 browserVersion = navUserAgent.substring(tempVersionOffset+6);
		 if ((tempVersionOffset=navUserAgent.indexOf("Version"))!=-1) 
		   browserVersion = navUserAgent.substring(tempVersionOffset+8);
		} else if ((tempVersionOffset=navUserAgent.indexOf("MSIE"))!=-1) {
		 browserName = "Microsoft Internet Explorer";
		 browserVersion = navUserAgent.substring(tempVersionOffset+5);
		} else if ((tempVersionOffset=navUserAgent.indexOf("Chrome"))!=-1) {
		 browserName = "Chrome";
		 browserVersion = navUserAgent.substring(tempVersionOffset+7);
		} else if ((tempVersionOffset=navUserAgent.indexOf("Safari"))!=-1) {
		 browserName = "Safari";
		 browserVersion = navUserAgent.substring(tempVersionOffset+7);
		 if ((tempVersionOffset=navUserAgent.indexOf("Version"))!=-1) 
		   browserVersion = navUserAgent.substring(tempVersionOffset+8);
		} else if ((tempVersionOffset=navUserAgent.indexOf("Firefox"))!=-1) {
		 browserName = "Firefox";
		 browserVersion = navUserAgent.substring(tempVersionOffset+8);
		} else if ( (tempNameOffset=navUserAgent.lastIndexOf(' ')+1) < (tempVersionOffset=navUserAgent.lastIndexOf('/')) ) {
		 browserName = navUserAgent.substring(tempNameOffset,tempVersionOffset);
		 browserVersion = navUserAgent.substring(tempVersionOffset+1);
		 if (browserName.toLowerCase()==browserName.toUpperCase()) {
		  browserName = navigator.appName;
		 }
		}
		
		// trim version
		if ((tempVersion=browserVersion.indexOf(";"))!=-1)
		   browserVersion=browserVersion.substring(0,tempVersion);
		if ((tempVersion=browserVersion.indexOf(" "))!=-1)
		   browserVersion=browserVersion.substring(0,tempVersion);

		return {
			browser: browserName,
			release: browserVersion
		}
	}

	sendPortfolioEvent(evento:PortfolioPropertyAction) {
		this.listeningCreatePortfolioProp.next(evento);
	}
}
