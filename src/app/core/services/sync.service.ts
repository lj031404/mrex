import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, from, Subscription, timer } from 'rxjs';
import { PropertiesService } from '@app/core/localDB/properties.service';
import * as api from '@app/api_generated/api/api';
import { Property } from '../models/property.interface';
import { HypothesisLocal } from '../models/hypothesis.interface';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { BanksParametersService } from '@app/shared/services/banks-parameters.service';
import { WatchlistDbService } from '../localDB/watchlist.service';

import { PortfolioService } from '@app/api_generated/api/api';
import { PortfolioLocalService } from '../localDB/portfolio.service';
import { HomeService } from './home.service';
import { LayoutService } from '@app/layout/service/layout.service'
import { TranslateService } from '@ngx-translate/core';
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service'
import { filter, flatMap, take, takeUntil } from 'rxjs/operators';
import { LokijsService } from '../localDB/lokijs.service';

@Injectable({
	providedIn: 'root'
})
export class SyncService {

	isSynced$ = new BehaviorSubject<boolean>(false)
	isOnline$ = new BehaviorSubject<boolean>(true)

	watchlistReady$ = new BehaviorSubject<boolean>(false)

	stats = {}
	startDate: Date

	sub: Subscription
	constructor(
		private propertiesService: PropertiesService,
		private propertiesApiService: api.PropertiesService,
		private hypothesisApiService: api.HypothesisService,
		private banksParametersService: BanksParametersService,

		private userSettingsMiddleware: UserSettingsMiddlewareService,
		private logger: NGXLogger,
		private watchlistDbService: WatchlistDbService,

		private portfolioLocalService: PortfolioLocalService,
		private portfolioService: PortfolioService,
		private homeService: HomeService,
		private layoutService: LayoutService,
		private translate: TranslateService,
		private middleware: MarketMiddlewareService,
		private loki: LokijsService
	) {}

	get isSynced() {
		return this.isSynced$.value
	}

	get isOnline() {
		return this.isOnline$.value
	}

	saveDuration(name) {
		this.stats[name] = (new Date().getTime() - this.startDate.getTime()) / 1000
	}

	async sync(): Promise<void> {

		return new Promise((resolve, reject) => {
			this.loki.isReady$.pipe(filter(isReady => isReady), take(1)).subscribe(async () => {
				this.startDate = new Date()

				const requests: Promise<any>[] = [
					this.syncHomeInformation().then(() => this.saveDuration('syncHomeInformation')).then(() => this.isSynced$.next(true)),
					this.userSettingsMiddleware.sync().then(() => this.saveDuration('userSettingsMiddleware')),
					this.banksParametersService.sync().then(() => this.saveDuration('banksParametersService')),
					this.syncProperties().then(() => this.saveDuration('syncProperties')),
					this.syncWatchlist().then(() => this.saveDuration('syncWatchlist')),
					this.syncPortfolio().then(() => this.saveDuration('syncPortfolio')),
					this.middleware.getSavedSearchData().then(() => this.saveDuration('getSavedSearchData')),
				]

				try {
					await Promise.all(requests).then(() => this.saveDuration('total'))
					console.info('[Sync] All Data synced')
					console.log('[Sync Stats]', this.stats)
					resolve()
				}
				catch (err) {
					console.log('syncService', err)
					console.error(err)
					timer(0, 5000).pipe(
						takeUntil(this.isSynced$),
						flatMap(() => from(this.sync()))
					)
					this.layoutService.openSnackBar(this.translate.instant('core.sync.err'), null, 5000, 'error')
					reject(err)
				}
			})


		})



	}

	async syncHomeInformation(): Promise<void> {
		await Promise.all([
			this.homeService.getHomeInformation().toPromise(),
			this.homeService.getLatestBuild().toPromise(),
			this.homeService.getCities().toPromise(),
			this.homeService.getRecentListings().toPromise(),
			this.homeService.getRecentlySold().toPromise(),
			this.homeService.getWatchlistProperties().toPromise(),
			this.homeService.getArticleVideos(0, 10, true),
			this.homeService.getVideoPortal(0, 10, true).toPromise()
		])
	}

	/****************** Watchlist **********************/
	async syncWatchlist(): Promise<void> {
		await this.watchlistDbService.sync()
		this.watchlistReady$.next(true)
	}

	/****************** Portfolio **********************/
	async syncPortfolio(): Promise<void> {

		return new Promise((resolve, reject) => {
			this.propertiesService.isReady$.pipe(filter(isReady => isReady), take(1)).subscribe(async () => {
				try {
					console.info('[Sync] Synchronizing portfolio')

					await Promise.all([
						this.portfolioLocalService.getPortfolioSummary(true).then(() => this.saveDuration('getPortfolioSummary')),
						this.portfolioLocalService.getPortfolioPendingPortfolios(true).then(() => this.saveDuration('getPortfolioPendingPortfolios')),
						this.portfolioLocalService.getPortfolioDraftPros().then(() => this.saveDuration('getPortfolioDraftPros')),
					])

					const portfolioSummary = await this.portfolioService.getPortfoliosSummary().toPromise()
					const portfolioIds$ = portfolioSummary.properties.map(x => x.portfolioId)

					const portfolioProperties = await Promise.all(portfolioIds$.map(async (portfolioId) => {
						return this.portfolioService.getPortfolioProperty(portfolioId).toPromise()
					}))

					portfolioProperties.map(x => this.portfolioLocalService.save(x))

					console.info('[Sync] User portfolio synced!')
					resolve()

				}
				catch (err) {
					const msg = `[syncPortfolio] Got errors: ${err}`
					console.error(msg)
					reject(msg)
				}
			})
		})


	}

	/****************** PROPERTIES **********************/
	async syncProperties(): Promise<void> {
		try {
			console.info('[Sync] Synchronizing user properties')

			const apiProperties = await this.propertiesApiService.getUserProperties().toPromise()

			await this.saveApiPropertiesToLocal(apiProperties)

			console.info('[Sync] User properties synced!')
		}
		catch (err) {
			const msg = `[syncProperties] Got errors: ${err}`
			console.error(msg)
		}
	}

	async saveApiPropertiesToLocal(apiProperties: Property[]): Promise<void> {
		let countProperties = 0

		const propertyIds = apiProperties.map((x: any) => x.id)
		const apiHypothesis = await this.hypothesisApiService.listUserHypothesis(propertyIds).toPromise()

		apiProperties.map(async property => {
			const hypothesis = apiHypothesis.find(x => x.input.propertyId === property.id)
			countProperties++
			return this.propertiesService.save(property, hypothesis)
		})

		console.log(`[Sync] ${countProperties} properties synced`)
	}

	/****************** HYPOTHESIS **********************/

	async saveApiHypothesisToLocal(apiHypothesis: HypothesisLocal[]): Promise<void> {
		let count = 0
		apiHypothesis.map(async (hypothesis) => {
			this.propertiesService.save(null, hypothesis)
			this.propertiesService.getByPropertyId(hypothesis.input.propertyId)
			count++
		})
		console.log(`[Sync]: ${count} hypothesis synced`)
	}
}
