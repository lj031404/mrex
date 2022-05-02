import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/browser'
import { RouterMap } from '@app/core/utils/router-map.util';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { _translate } from '@app/core/utils/translate.util';
import { GlobalService } from '@app/core/services/global.service';
import { SpinnerService } from '@app/shared/services/spinner.service';

const SettingsRouterMap = RouterMap.Settings

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	settingsItems = [
		/*{
			name: _translate('page.settings.list.profile'),
			iconClass: 'fas fa-user fa-lg',
			link: SettingsRouterMap.url([SettingsRouterMap.PROFILE])
		},*/
		{
			name: _translate('page.settings.list.preferences'),
			iconClass: 'mi mi-settings-input-component',
			link: SettingsRouterMap.url([SettingsRouterMap.PREFERENCES])
		},
		{
			name: _translate('page.settings.list.payment'),
			iconClass: 'fas fa-dollar-sign fa-lg',
			link: SettingsRouterMap.url([SettingsRouterMap.PAYMENT])
		},
		/*{
			name: _translate('page.settings.list.buy_credits'),
			iconClass: 'fa fa-coins',
			link: SettingsRouterMap.url([SettingsRouterMap.BUY_CREDITS])
		},*/
		{
			name: _translate('page.settings.list.report'),
			iconClass: 'mi mi-mode-comment',
			link: SettingsRouterMap.url([SettingsRouterMap.REPORT])
		},
		{
			name: _translate('page.settings.list.about'),
			iconClass: 'fas fa-info-circle fa-lg',
			link: SettingsRouterMap.url([SettingsRouterMap.ABOUT])
		}
	]

	constructor(
		private authenticationService: AuthenticationService,
		private router: Router,
		private globalService: GlobalService,
		private spinnerService: SpinnerService
	) { }

	ngOnInit() {
	}

	async logout() {
		try {
			this.spinnerService.show()
			this.globalService.logOutEventListener$.next(false)
			await this.authenticationService.logout()
			localStorage.clear()
			this.router.navigate(['login'])
		}
		catch (err) {
			console.error(err)
			Sentry.captureException(`[settings.component: logout] Error : ${JSON.stringify(err)}`)
		}
		this.spinnerService.hide()
	}
}
