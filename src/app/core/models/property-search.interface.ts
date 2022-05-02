import { ListingShort, ModelProperty, ModelPropertyShort } from '@app/api_generated';
import { ModelPropertyShortDb } from './modelPropertyShortDb';

export interface PropertySearchDrawerEvent {
	type: PropertySearchDrawerEventType;
	data: ModelPropertyShortDb | null;
}

export enum PropertySearchDrawerEventType {
	IMPORT = 'import',
	CREATE = 'create'
}

export enum PROPERTY_SORT_BY {
	DISTANCE = 'distance'
}

export interface PropertySearchOnMarketListing {
	total: number
	properties: ListingShort[]
}

export interface PropertySearchResultOnMap {
	groups: PropertyGroupOnMap[]
	properties: ListingShort[]
	total: number
}

export interface PropertyGroupOnMap {
	id: string
	count: number
	lat: number
	lng: number
}
