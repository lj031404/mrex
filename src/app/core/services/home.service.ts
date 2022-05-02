import { Injectable } from '@angular/core';
import { AppStorage } from './storage'
import { HomeService as ApiHomeSevice } from '@app/api_generated/api/home.service';
import { BlogService as ApiBlogService } from '@app/api_generated/api/blog.service';
import { VideosService as ApiVideoiService } from '@app/api_generated/api/videos.service'
import { VideoArticleListItem } from '@app/api_generated/model/videoArticleListItem'
import { VideosPortal } from '@app/api_generated/model/videosPortal';
import { BehaviorSubject, Observable } from 'rxjs';
import { VideoListItem } from '@app/api_generated';
import { MarketsService } from '@app/api_generated';
import { SystemService } from '@app/api_generated/api/system.service';

@Injectable({
	providedIn: 'root'
})
export class HomeService {
	public allArticles: VideoArticleListItem[] = [];
	homeSearchKey = ''
	activeTab = '';

	public inputAddress = new BehaviorSubject<string>('')
	inputAddress$ = this.inputAddress.asObservable()

	constructor(
		private apiHomeService: ApiHomeSevice,
		private blogService: ApiBlogService,
		private videoService: ApiVideoiService,
		private marketService: MarketsService,
		private systemService: SystemService,
	) {
		this.activeTab = localStorage.getItem('homeActiveTab')
	 }

	getHomeInformation(fetchApi = false) {
		return AppStorage.cache(
			'getHomeData',
			this.apiHomeService.getHome(),
			fetchApi
		)
	}

	getRecentListings(fetchApi = false) {
		return AppStorage.cache(
			'getRecentListings',
			this.apiHomeService.getRecentListings(),
			fetchApi
		)
	}

	getWatchlistProperties(fetchApi = false) {
		return AppStorage.cache(
			'getWatchlistProperties',
			this.apiHomeService.getWatchlistProperties(),
			fetchApi
		)
	}

	getRecentlySold(fetchApi = false) {
		return AppStorage.cache(
			'getRecentlySold',
			this.apiHomeService.getRecentlySold(),
			fetchApi
		)
	}

	getAllArticles(fetchApi = false) {
		return AppStorage.cache(
			'getAllArticles',
			this.blogService.getArticles(),
			fetchApi
		)
	}

	getAllVideos(skip = 0, limit = 5, fetchApi = false): Observable<VideoListItem[]> {
		return AppStorage.cache(
			`getAllVideos${skip}-${limit}`,
			this.videoService.getVideos(skip, limit),
			fetchApi
		)
	}

	getAllSocialVideos(skip = 0, limit = 5, fetchApi = false): Observable<VideoListItem[]> {
		return AppStorage.cache(
			`getAllSocialVideos${skip}-${limit}`,
			this.videoService.getVideos(skip, limit, 'publishDate', 'social'),
			fetchApi
		)
	}

	async getArticleVideos(skip = 0, limit = 10, fetchApi = false): Promise<VideoListItem[]> {
		return AppStorage.cache(
			`getArticleVideos${skip}-${limit}`,
			this.blogService.getVideosArticles(skip, limit),
			fetchApi
		).toPromise()
	}

	getVideoPortal(skip = 0, limit = 5, fetchApi = false): Observable<VideosPortal> {
		return AppStorage.cache(
			`getVideoPortal-${skip}-${limit}`,
			this.videoService.getVideosPortal(skip, limit),
			fetchApi
		)
	}

	getCities(fetchApi = false): Observable<any> {
		return AppStorage.cache(
			`getCities`,
			this.marketService.getCities(),
			fetchApi
		)
	}

	getDistricts(cityId: string, fetchApi = false): Observable<any> {
		return AppStorage.cache(
			`getDistricts-${cityId}`,
			this.marketService.getDistricts(cityId),
			fetchApi
		)
	}

	getMarketId(cityId, districtId, propertyType, fetchApi = false): Observable<any> {
		return AppStorage.cache(
			`getMarketId-${cityId}-${districtId}-${propertyType}`,
			this.marketService.getMarketId(cityId, districtId, propertyType),
			fetchApi
		)
	}

	getChartId(cityId, chartId, fromDate, districtId, propertyType, fetchApi=false): Observable<any> {
		return AppStorage.cache(
			`getChartId-${cityId}-${chartId}-${fromDate}-${districtId}-${propertyType}`,
			this.marketService.getChartId(cityId, chartId, fromDate, districtId, propertyType),
			fetchApi
		)
	}

	public saveActiveTab(activeTab: string) {
		this.activeTab = activeTab
		localStorage.setItem('homeActiveTab', activeTab)
	}

	getInputAddress(address: string) {
		this.inputAddress.next(address)
	}

	getLatestBuild(fetchApi = false) {
		return AppStorage.cache(
			`getLatestBuild`,
			this.systemService.getLatestBuild(),
			fetchApi
		)
	}
}
