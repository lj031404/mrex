import { Injectable } from '@angular/core';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { HomeService } from '@app/core/services/home.service';
import { LayoutService } from '@app/layout/service/layout.service';
import { PlansService } from '@app/shared/services/plans.service';
import { PromptService } from '@app/shared/services/prompt.service';
import { TranslateService } from '@ngx-translate/core';
import { WatchlistDbService } from '../localDB/watchlist.service';
import { PromptChoice } from '../models/prompt-choice.interface';
import { SyncService } from './sync.service';

@Injectable({
	providedIn: 'root'
})
export class WatchlistMiddlewareService {

	constructor(
		private watchlistDbService: WatchlistDbService,
		private plansService: PlansService,
		private translate: TranslateService,
		private promptService: PromptService,
		private userSettingsMiddleware: UserSettingsMiddlewareService,
		private layoutService: LayoutService,
		private homeService: HomeService,
		private syncService: SyncService
		) { }

	async favorite(isFavorite: boolean, propertyId: string) {
		const watchlists = this.watchlistDbService.list()
		const watchlist = watchlists.slice(-1)[0]

		// check if an upgrade is required
		const { upgradeRequired, requiredPlan, currentPlan } = await this.plansService.minimumRequiredPlan('watchlist_items')

		// If upgrade is required, redirect to the subscription page
		if (upgradeRequired && isFavorite) {
			isFavorite = false

			const planName = this.translate.instant(`plans.${currentPlan}`)
			const newPlanName = this.translate.instant(`plans.${requiredPlan}`)

			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
				{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
			]

			const translated = this.translate.instant('billing.prompt.limitReached.watchlist', {
				planName,
				newPlanName
			})

			throw {
				prompt: this.promptService.prompt('', translated, promptChoices),
				requiredPlan
			}

		}
		// No upgrade required, it can be added to the watchlist
		else {

			const user: any = await this.userSettingsMiddleware.user
			// Because usage for watchlist_items is done later, we must deduct 1 now
			const buildings = user.subscription.limits['watchlist_items'] - user.usage['watchlist_items'] - 1
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
			]
			const translated = this.translate.instant('page.market.market_listing.have_building_watchlist', {
				buildings
			})

			if (isFavorite) {
				if (buildings <= 10) {
					await this.promptService.prompt('', translated, promptChoices).toPromise()
				}
				await this.watchlistDbService.addProperty(watchlist, propertyId)
				this.layoutService.openSnackBar(this.translate.instant('pages.market_listing.watchlist_added'), null, 3000, 'info')
				this.watchlistDbService.addProperty$.next(propertyId)
			} else {
				await this.watchlistDbService.removeProperty(watchlist, propertyId)
				this.layoutService.openSnackBar(this.translate.instant('pages.market_listing.watchlist_removed'), null, 3000, 'info')
				this.watchlistDbService.removeProperty$.next(propertyId)
			}

			await Promise.all([
				this.homeService.getHomeInformation(true),
				this.userSettingsMiddleware.sync(),
				this.syncService.syncWatchlist()
			])

			return isFavorite
		}
	}
}
