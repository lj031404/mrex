import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { WatchlistProperty, WatchlistService } from '@app/api_generated';
import { LokijsService } from './lokijs.service';
import { Collection } from 'lokijs';

export interface WatchlistDoc {
	properties: WatchlistProperty[],
	id: string // watchlistId
	name: string
	localUpdateTime: number

	// Loki stuff
	$loki?: number
	meta?: {
		revision: number
		created: number
		version: number
	}
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistDbService {

	public addProperty$ = new BehaviorSubject<string>('')
	public removeProperty$ = new BehaviorSubject<string>('')
	public changeModelsCount$ = new BehaviorSubject<boolean>(false)

	private dbHandler: Collection

	constructor(
		private watchlistApiService: WatchlistService,
		private logger: NGXLogger,
		private loki: LokijsService
	) {
		this.dbHandler = this.loki.db.addCollection('watchlists')
	}

	save(id: string, name: string, properties: WatchlistProperty[]) {
		const saveData: WatchlistDoc = {
			id,
			name,
			properties,
			localUpdateTime: +new Date()
		}
		let watchlist = this.findByWatchlistId(id)
		if (watchlist) {
			watchlist = { ...watchlist, ...saveData }
			this.dbHandler.update(watchlist)
			console.info('Watchlist have been updated locally')
		}
		else {
			this.dbHandler.insert(saveData)
			console.info('Watchlist have been added locally')
		}
	}

	list(): WatchlistDoc[] {
		return this.dbHandler.find({})
	}

	getCurrent(): WatchlistDoc {
		const watchlists = this.list()
		const watchlist = watchlists.slice(-1)[0]
		return watchlist
	}

	get(id: number): WatchlistDoc {
		return this.dbHandler.get(id)
	}

	findByWatchlistId(id: string): WatchlistDoc {
		return this.dbHandler.findOne({ id })
	}

	async addProperty(watchlist: WatchlistDoc, propertyId: string) {
		const property = await this.watchlistApiService.addToWatchlist(watchlist.id, propertyId).toPromise()
		const exist = watchlist.properties.find(x => x.id)
		if (!exist) {
			watchlist.properties.push(property)
		}
		this.save(watchlist.id, watchlist.name, watchlist.properties)
	}

	async removeProperty(watchlist: WatchlistDoc, propertyId: string): Promise<void> {
		await this.watchlistApiService.deleteWatchlistProperty(watchlist.id, propertyId).toPromise()
		watchlist.properties = watchlist.properties.filter(x => x.id !== propertyId)
		this.save(watchlist.id, watchlist.name, watchlist.properties)
	}

	async deletePendingWatchlist(id: string): Promise<void> {
		await this.watchlistApiService.deletePendingWatchlist(id).toPromise()
	}

	async sync() {
		console.info('[Sync] Synchronizing watchlist')
		let watchlists = await this.watchlistApiService.listWatchlists().toPromise()
		if (watchlists.length === 0) {
			await this.watchlistApiService.createWatchlist({ name: 'My first watchlist' }).toPromise()
			watchlists = await this.watchlistApiService.listWatchlists().toPromise()
		}
		const watchlist = watchlists.slice(-1)[0]
		const properties = await this.watchlistApiService.listWatchlistProperties(watchlist.id).toPromise()
		this.save(watchlist.id, watchlist.name, properties)
		console.log('[Sync] Watchlist successfully sync')
	}

}
