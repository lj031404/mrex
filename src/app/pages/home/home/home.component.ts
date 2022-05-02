import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PromptService } from '@app/shared/services/prompt.service';
import { PromptChoice } from '@app/core/models/prompt-choice.interface';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';

import { MarketinfoshareService } from '@app/pages/market/adapter/marketinfoshare.service';
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service';
import { Error } from '@app-models/err.interface';
import { Portfolio, ListedProperty, News } from '@app-models/home.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { _translate } from '@app/core/utils/translate.util';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '@app/core/services/global.service';
import { UserService as UserDBService } from '@app/core/localDB/user.service';
import { HomeService } from '@app-core/services/home.service';
import { VideoArticleListItem } from '@app/api_generated/model/videoArticleListItem'
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { merge, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ModalRef } from '@app-models/modal-ref'
import { ActionDrawerComponent } from '@app/layout/component/action-drawer/action-drawer.component'
import { ActionDrawerOutletComponent } from '@app/layout/component/action-drawer-outlet/action-drawer-outlet.component'
import { PropertySearchDrawerEvent } from '@app-models/property-search.interface'
import * as _ from 'lodash'
import { LayoutService } from '@app/layout/service/layout.service';
import { RouterMap } from '@app/core/utils/router-map.util';
import { FormControl, FormGroup } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { version } from '@app/git-version.json'
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { WatchlistDbService } from '@app/core/localDB/watchlist.service';

const ARTICLE_CARD_HEIGHT = 98
const ARTICLE_LIST_TOP_HEIGHT = 94
const PROPERTY_LIST_TOP_HEIGHT = 83.8
const MARKETSSTATS_TOP_HEIGHT = 82.36

type LatestArticle =  VideoArticleListItem & {
	isLoaded?: boolean
	loadErr?: boolean
}
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, OnDestroy {
	@ViewChild('mainDrawer', { static: true }) mainDrawer: ActionDrawerComponent
	@ViewChild('propertySearchDrawerWrapper', { static: true }) propertySearchDrawer: ActionDrawerComponent
	@ViewChild('drawerOutlet', { static: true }) drawerOutlet: ActionDrawerOutletComponent
	@ViewChild('articleSummary', { static: true }) articleSummary

	activePropertySearchDrawer = false

	propertyAddModalRef: ModalRef

	choices: PromptChoice[]
	address = ''
	err: Error
	isLoading = true
	portfolio: Portfolio[];
	slidersSections: ListedProperty[] = []
	news: News[] = []
	user
	currentTab = 'media'
	allArticles: VideoArticleListItem[];
	subscription = new Subscription()
	isLoadMore: boolean
	loadMoreCount = 0
	latestArticle: LatestArticle
	disableLoadMore: boolean
	isShowTabSkeleton: boolean

	@ViewChild('content', { static: true }) private content: ElementRef<HTMLElement>
	@ViewChild('tabList', { static: true }) private tabList: ElementRef<HTMLElement>
	@ViewChild('homePropertyList', { static: true }) private homePropertyList: ElementRef<HTMLElement>
	@ViewChild('homeArticleList', { static: true }) private homeArticleList: ElementRef<HTMLElement>
	@ViewChild('homeMarketStats', { static: true }) private homeMarketStats: ElementRef<HTMLElement>

	searchForm: FormGroup
	emptyMedias = ['', '', '', '']
	mobileOperators = [
		'Windows Phone',
		'Android',
		'iOS'
	]
	currentVersion = version
	isDev
	userImageSrc = 'assets/images/default-account.jpg'
	isMoreDescription: boolean
	canScroll: boolean

	constructor(
		private promptService: PromptService,
		private infoService: MarketinfoshareService,
		private middleware: MarketMiddlewareService,
		private router: Router,
		private translate: TranslateService,
		private globalService: GlobalService,
		private userDBService: UserDBService,
		private homeService: HomeService,
		private layoutService: LayoutService,
		private settingsMiddleware: UserSettingsMiddlewareService,
		private theInAppBrowser: InAppBrowser,
		private activatedRoute: ActivatedRoute,
		private tabsStatesService: TabsStatesService,
		private watchlistDbService: WatchlistDbService,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.infoService.inputAddress$.subscribe(res => this.address = res)
		this.middleware.setCurrentPositionFilter()
		this.settingsMiddleware.userLanguageSettingEvent.subscribe((res) => {
			this.getMedia(true)
		})

		this.searchForm = new FormGroup({
			search: new FormControl()
		})

		this.searchForm.valueChanges.pipe(
			debounceTime(300)
		).subscribe(res => {
			this.homeService.getInputAddress(res.search)
			this.infoService.getInputAddress(res.search)
			this.router.navigate([RouterMap.Search.path])
		})

		// Open the modal when a query param is provided
		this.activatedRoute.queryParams.subscribe(async (params) => {
			if (params.articleId) {
				try {
					this.showArticle({ id: params.articleId, type: 'article' })
				}
				catch (err) {
					this.layoutService.openSnackBar(this.translate.instant('error.article'), null, 5000, 'error')
				}
			}
			else if (params.videoId) {
				try {
					this.showArticle({ id: params.videoId, type: 'video' })
				}
				catch (err) {
					this.layoutService.openSnackBar(this.translate.instant('error.article'), null, 5000, 'error')
				}
			}
		})

		this.settingsMiddleware.isDevStatus.subscribe(res => {
			this.isDev = res
		})

		// Route enter and leave subscriptions
		this.tabsStatesService.enter$.pipe(filter(url => url === `/${RouterMap.Home.HOME}`)).subscribe(url => {
			if(localStorage.getItem("homeActiveTab") === null){
				this.switchTab('media')
				this.changeDetectorRef.detectChanges()
			}
			this.content.nativeElement.scrollTo(0, this.tabsStatesService.get('home-scrollY'))
		})

		this.tabsStatesService.leave$.pipe(filter(url => url === `/${RouterMap.Home.HOME}`)).subscribe(url => {
			this.content.nativeElement.removeEventListener("scroll", this.scrollHandler.bind(this), true);
			this.tabsStatesService.save('home-scrollY', this.content.nativeElement.scrollTop)
		})

	}

	async ngOnInit() {
		try {
			this.getMedia()
			this.initVersionCheck()

			this.choices = [
				{ key: 'yes', label: this.translate.instant('page.home.rateUs.yes'), class: 'btn btn-outline-green' },
				{ key: 'no', label: this.translate.instant('page.home.rateUs.no'), class: 'btn btn-outline-light' },
			]
			const os = this.globalService.getMobileOperatingSystem()

			if (localStorage.getItem('lastOpenDate')) {
				const skipDate = moment(localStorage.getItem('lastOpenDate'))
				const currentDate = moment(new Date().toString())
				const diffDays = moment.duration(currentDate.diff(skipDate)).asDays()
				if (diffDays > 6 && this.mobileOperators.includes(os)) {
					this.openRateModal()
				}
			}

			this.content.nativeElement.addEventListener('scroll', this.scrollHandler.bind(this), true)

			localStorage.setItem('lastOpenDate', new Date().toString())

			this.getHomeData()

			if (this.homeService.activeTab) {
				this.currentTab = this.homeService.activeTab
			}

			this.user = await this.userDBService.getUserInfo()

			merge(
				this.watchlistDbService.addProperty$,
				this.watchlistDbService.removeProperty$
			)
			.subscribe(async () => {
				const watchlistProperties = await this.homeService.getWatchlistProperties(true).toPromise()
				this.slidersSections[1].list = watchlistProperties
				this.slidersSections[1].isLoading = false
				this.changeDetectorRef.markForCheck()
			})

		} catch (err) {
			console.error(err)
		}

		this.changeDetectorRef.detectChanges()
	}

	onHorizontalScroll(event) {
		this.tabsStatesService.save('home-' + event.key, event.scroll)
	}
	
	scrollHandler() {
		if (this.currentTab === 'media') {
			if (this.homeArticleList.nativeElement.getBoundingClientRect().top < ARTICLE_LIST_TOP_HEIGHT) {
				this.tabList.nativeElement.classList.add('fixed-tab')
				// Used document.getElementsByTagName since viewChild doesnt work well in this case.
				document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.add('overflow-auto')
			} else {
				this.tabList.nativeElement.classList.remove('fixed-tab')
				document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.remove('overflow-auto')
			}
		}

		if (this.currentTab === 'properties') {
			if (this.homePropertyList.nativeElement.getBoundingClientRect().top < PROPERTY_LIST_TOP_HEIGHT) {
				this.tabList.nativeElement.classList.add('fixed-tab')
			} else {
				this.tabList.nativeElement.classList.remove('fixed-tab')
			}
		}

		if (this.currentTab === 'marketstats') {
			if (this.homeMarketStats.nativeElement.getBoundingClientRect().top < MARKETSSTATS_TOP_HEIGHT) {
				this.tabList.nativeElement.classList.add('fixed-tab')
			} else {
				this.tabList.nativeElement.classList.remove('fixed-tab')
			}
		}

		if (this.content && this.currentTab === 'media') {
			const offsetHeight = this.content.nativeElement.offsetHeight
			if (offsetHeight + Math.round(this.content.nativeElement.scrollTop) >= this.content.nativeElement.scrollHeight) {
				// Used document.getElementsByTagName since viewChild doesnt work well in this case.
				document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.add('overflow-auto')
			} else {
				document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.remove('overflow-auto')
			}
		}

	}

	ngOnDestroy() {
		this.content.nativeElement.removeEventListener("scroll", this.scrollHandler.bind(this), true);
	}

	async openRateModal() {
		const answer = await this.promptService.prompt(this.translate.instant('page.home.rateUs.title'), this.translate.instant('page.home.rateUs.text'), this.choices).toPromise()
		if (answer === 'yes') {
			const os = this.globalService.getMobileOperatingSystem()
			switch (os) {
				case 'Android':
					this.theInAppBrowser.create('https://play.google.com/store/apps/details?id=co.mrex.mobile', '_system')
					break
				case 'iOS':
					this.theInAppBrowser.create('itms-apps://itunes.apple.com/app/1521592738', '_system')
					break;
				case 'unknown':
					this.theInAppBrowser.create('https://play.google.com/store/apps/details?id=co.mrex.mobile', '_system')
					break
			}

		}
		return this.userDBService.save(this.user)
	}

	getInputAddress(evt: Event) {
		const filter = this.middleware.getCurrentFilterCriteria()
		this.infoService.getInputAddress(this.address)
		this.middleware.setFilterCriteria(filter)
		this.router.navigate([RouterMap.Search.path])
	}

	async getHomeData(fetchApi = false) {
		try {
			const homeInformation = await this.homeService.getHomeInformation(fetchApi).toPromise()
			this.portfolio = Object.keys(homeInformation.portfolio).map(key => ({
				value: homeInformation.portfolio[key],
				type: key
			}))
			this.news = homeInformation.news && homeInformation.news.map(news => ({
				...news,
				text: this.getNewsText(news)
			}))

			this.slidersSections = [
				{
					list: [],
					key: 'recentListings',
					loadMoreCount: 1,
					disableLoadMore: false,
					isLoading: true
				},
				{
					list: [],
					key: 'watchlistProperties',
					loadMoreCount: 1,
					disableLoadMore: false,
					isLoading: true
				},
				{
					list: [],
					key: 'recentlySold',
					loadMoreCount: 1,
					disableLoadMore: false,
					isLoading: true
				}
			]

			const recentListings = await this.homeService.getRecentListings(fetchApi).toPromise()
			this.slidersSections[0].list = recentListings
			this.slidersSections[0].isLoading = false

			const watchlistProperties = await this.homeService.getWatchlistProperties(fetchApi).toPromise()
			this.slidersSections[1].list = watchlistProperties
			this.slidersSections[1].isLoading = false

			const recentlySold = await this.homeService.getRecentlySold(fetchApi).toPromise()
			this.slidersSections[2].list = recentlySold
			this.slidersSections[2].isLoading = false
		} catch (error) {
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
		}

		this.changeDetectorRef.detectChanges()
	}

	async getMedia(fetchApi = false): Promise<void> {
		try {
			this.isLoading = true
			this.homeService.allArticles = this.allArticles = await this.homeService.getArticleVideos(0, 10, fetchApi)

			if (this.allArticles && this.allArticles.length) {
				this.latestArticle = this.allArticles[0]
				this.changeDetectorRef.detectChanges()
			}

			this.disableLoadMore = this.allArticles.length < 10
			this.loadMoreCount = 1
			this.isLoading = false
		}
		catch (err) {
			console.error(err)
			this.isLoading = false
		}
	}

	getNewsText(news: News): string {
		let text = ''
		switch (news.type) {
			case 'priceDrop':
				text = _translate(this.translate.instant(`page.home_news.text_${news.type}`, { price: news.amount, currency: news.currency }))
				break
		}

		return text
	}

	switchTab(tab: string) {
		this.currentTab = tab;
		this.homeService.saveActiveTab(tab)
		this.isShowTabSkeleton = true
		this.isShowTabSkeleton = false
	}

	async loadMore(): Promise<void> {
		try {
			this.isLoadMore = true
			const res = await this.homeService.getArticleVideos(this.loadMoreCount * 10, 10, true)
			this.allArticles = _.uniqBy(this.allArticles ? this.allArticles.concat(res) : res, 'id')
			this.homeService.allArticles = _.uniqBy(this.allArticles.concat(res), 'id')
			if (this.allArticles && this.allArticles.length) {
				this.latestArticle = this.allArticles[0]
			}
			this.loadMoreCount += 1
			this.disableLoadMore = res.length < 10
			this.isLoadMore = false
		}
		catch (err) {
			this.isLoadMore = false
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
		}
		this.changeDetectorRef.detectChanges()
	}

	// Property Search List
	createProperty() {
		if (this.mainDrawer) {
			this.mainDrawer.close()
		}
		if (this.propertySearchDrawer) {
			this.addPropertySearchDrawer()
			this.propertySearchDrawer.open()
		}
	}

	importFromWatchlist() {
	}

	closePropertySearchDrawer() {
		this.drawerOutlet.closeDrawers();
	}

	onPropertySearchDrawerWrapperClosed() {
		this.removePropertySearchDrawer();
	}

	// TODO: Add or Remove Component by using ViewContainerRef
	addPropertySearchDrawer() {
		this.activePropertySearchDrawer = true
		this.drawerOutlet.openDrawer()
	}

	removePropertySearchDrawer() {
		this.activePropertySearchDrawer = false
	}

	onPropertySearchDrawerEventEmitted(event: PropertySearchDrawerEvent) {
		this.closePropertySearchDrawer()
		if (event) {
			this.router.navigate(['/portfolio/new'], {
				queryParams: {
					propertyId: event.data.id ? event.data.id : undefined,
					propertyData: JSON.stringify(event.data)
				}
			})
		}

	}

	clickAdd() {
		this.router.navigate(['/portfolio/new'])
	}

	showArticle(article) {
		this.router.navigate([RouterMap.Articles.ARTICLES], {
			queryParams: {
				id: article.id,
				type: article['type'] === 'video' ? 'video' : 'article'
			}
		})
	}

	async initVersionCheck() {
		const latestBuild: {
			mandatory: boolean
			version: string
		} = await this.homeService.getLatestBuild().toPromise()

		if (+this.currentVersion.replace('.', '') < +latestBuild['version'].replace('.', '')) {
			let choices = [
				{ key: 'yes', label: this.translate.instant('literals.upgrade'), class: 'btn btnOk' },
			]

			if (!latestBuild.mandatory) {
				choices.push(
					{ key: 'no', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
				)
			}
			const msg = this.translate.instant(latestBuild.mandatory ? 'pages.app.upgrade_required' : 'pages.app.new_version_available')
			
			const choice = await this.promptService.prompt('', msg, choices, latestBuild.mandatory).toPromise()

			if (choice === 'yes') {
				const os = this.globalService.getMobileOperatingSystem()
				let storeUrl
				switch (os) {
					case 'Android':
						storeUrl = 'https://play.google.com/store/apps/details?id=co.mrex.mobile'
						break
					case 'iOS':
						storeUrl = 'itms-apps://itunes.apple.com/app/1521592738'
						break;
					case 'unknown':
						storeUrl = 'https://play.google.com/store/apps/details?id=co.mrex.mobile'
						break
				}
				this.theInAppBrowser.create(storeUrl, '_system')
			}
		}
	}

	onScrollIndexChange(scrollIndex) {
		if (!this.disableLoadMore && !this.isLoadMore && (scrollIndex + 10 > this.allArticles.length) ) {
			this.loadMore()
		}
	}

}
