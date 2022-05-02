import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { SyncService } from '@app-services/sync.service'
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service';
import { UserService } from '@app/core/localDB/user.service';
import { FcmProvider } from '@app/shared/providers/push-notifications';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

	isLoading = true;
	nextScreen = ''

	constructor(
		private syncService: SyncService,
		private router: Router,
		private fcm: FcmProvider,
		private marketMiddleWare: MarketMiddlewareService,
		private userService: UserService
	) { }

	async ngOnInit() {
		this.nextScreen = history.state && history.state.syncingData && history.state.syncingData.wasLoading || ''

		try {
			this.syncService.isSynced$.pipe(filter(x => x)).subscribe(async (isSynced) => {
				this.navigateToMainPage()

				// retrieve a token
				await this.fcm.getPushToken()
				await this.fcm.saveTokenToServer()
				this.fcm.initPushNotifications()

				// Launch a search query in background (so that the list is not empty)
				this.marketMiddleWare.listPropertiesWithCurrentFilterCriteria().toPromise()
			})

			await this.syncService.sync()

			await this.userService.reportPosition()
		}
		catch (err) {
			console.error(err)
		}

	}

	navigateToMainPage() {
		this.router.navigateByUrl(this.nextScreen)
	}

}
