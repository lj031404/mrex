import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { AppLanguage } from '@app-models/language.enum';
import { MatSlideToggleChange } from '@angular/material';
import { SyncService } from '@app/core/services/sync.service';

@Component({
	selector: 'app-preferences',
	templateUrl: './preferences.component.html',
	styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
	AppLanguage = AppLanguage

	language = AppLanguage.English
	notification: boolean

	constructor(
		private settingsMiddleware: UserSettingsMiddlewareService,
		private logger: NGXLogger,
		private syncService: SyncService
	) { }

	ngOnInit() {
		this.language = this.settingsMiddleware.language as AppLanguage
		this.notification = this.settingsMiddleware.receiveNotification
	}

	onLanguageChange(event: Event) {
		if (event.type === 'change') {
			this.language = (event.target as HTMLSelectElement).value as AppLanguage
			console.log('Language setting changed', this.language)
			this.saveLanguageChange()
		}
	}

	onNotificationChange(event: MatSlideToggleChange) {
		this.notification = event.checked
		this.saveNotificationChange()
	}

	saveLanguageChange() {
		this.settingsMiddleware.language = this.language
		this.syncService.syncHomeInformation()
	}

	saveNotificationChange() {
		this.settingsMiddleware.receiveNotification = this.notification
	}
}
