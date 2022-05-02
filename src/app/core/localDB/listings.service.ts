import { Injectable } from '@angular/core';
import { Listing } from '@app/api_generated';
import { ListingDb } from '@app/pages/market/adapter/market-listing.adapter';
import { Collection } from 'lokijs';
import { LokijsService } from './lokijs.service';

export interface ListingDoc extends ListingDb {
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
export class ListingsService {
	private dbHandler: Collection

	constructor(private loki: LokijsService) {
		this.dbHandler = this.loki.db.addCollection('listings')
	}

	save(listing: Listing): ListingDoc {
		const doc = this.dbHandler.findOne({ id: listing.id })
		if (doc) {
			return this.dbHandler.update({ ...doc, ...listing, localUpdateTime: +new Date() })
		}
		else {
			return this.dbHandler.insert({ ...listing, localUpdateTime: +new Date() })
		}
	}

	getById(id): ListingDoc {
		return this.dbHandler.findOne({ id })
	}
}
