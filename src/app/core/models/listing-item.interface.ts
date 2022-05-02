import { ListingShort } from '@app/api_generated'

export enum ListingActivityFeedIconEnum {
	Added = './assets/images/viewicon.png',
	Price = './assets/icons/price-event.png',
	Calculator = './assets/icons/calculator-event.png',
	Home = './assets/icons/home.svg',
}

export interface ListingHistoryItem {
	price: number
	unit: string
	eventType: string
	from: string
	to: string
}

export interface ListingActivityFeed {
	icon: ListingActivityFeedIconEnum
	text: string
	feedDate: number
	linkLabel: string
	linkUrl: string
	redirect?: string
}

export interface ListingCard extends ListingShort {
	imageLoadErr?: boolean
	isLoaded?: boolean
}