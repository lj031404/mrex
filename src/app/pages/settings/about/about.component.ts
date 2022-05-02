import { Component, OnInit } from '@angular/core'

import { _translate } from '@app/core/utils/translate.util';
import { GlobalService } from '@app/core/services/global.service'
import { LayoutService } from '@app/layout/service/layout.service'
import { version, branch, hash } from '../../../git-version.json'
import { TermOfUseComponent } from '../modals/term-of-use/term-of-use.component'
import { PrivacyPolicyComponent } from '../modals/privacy-policy/privacy-policy.component';
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

	store = _translate(this.translate.instant('literals.google'))
	version = version
	branch = branch
	gitHash = hash

	storeUrl = ''
	facebookPage = 'https://www.facebook.com/mrexbourseimmo'

	constructor(
		private layoutService: LayoutService,
		private translate: TranslateService,
		private globalService: GlobalService,
		private theInAppBrowser: InAppBrowser,
		private router: Router
	) { }

	ngOnInit() {
		const storeStrings = [
			_translate('store.google'),
			_translate('store.app_store')
		]

		const os = this.globalService.getMobileOperatingSystem()

		switch (os) {
			case 'Android':
				this.store = 'Google Play'
				this.storeUrl = 'https://play.google.com/store/apps/details?id=co.mrex.mobile'
				break
			case 'iOS':
				this.store = 'Apple Store'
				this.storeUrl = 'itms-apps://itunes.apple.com/app/1521592738'
				break;
			case 'unknown':
				this.store = 'Google Play'
				this.storeUrl = 'https://play.google.com/store/apps/details?id=co.mrex.mobile'
				break
		}
	}

	openAppStore() {
		this.theInAppBrowser.create(this.storeUrl, '_system')
	}

	openFacebookPage() {
		this.theInAppBrowser.create(this.facebookPage, '_system')
	}

	onTermOfUseClick() {
		this.router.navigate([ RouterMap.Settings.TERM_OF_USE ])
	}

	onPrivacyPolicyClick() {
		this.router.navigate([ RouterMap.Settings.PRIVACY ])
	}


}
