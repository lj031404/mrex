import { WatchlistPropertyHome } from '@app/api_generated/model/watchlistPropertyHome';
import { HomeNews } from '@app/api_generated/model/homeNews';

export interface Portfolio {
	value: number,
	type: string;
}


export interface ListedProperty extends WatchlistPropertyHome {
	list?: Array<any>;
	key?: string;
	loading?: boolean;
	loadMoreCount?: number;
	disableLoadMore?: boolean;
	isLoading?: boolean
}

export interface News extends HomeNews {
	text?: string
}
