import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { GlobalService } from '@app/core/services/global.service';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { filter, map } from 'rxjs/operators';
import { RouterMap } from '@app/core/utils/router-map.util';

const TABS = [
	{
		icon: 'house',
		title: 'layout.footer.home',
		activeIcon: 'house_active',
		href: RouterMap.Home.path,
		_href: RouterMap.Home.path,
		active: false,
		key: 'home'
	},
	{
		icon: 'map',
		title: 'layout.footer.marketplace',
		activeIcon: 'map_active',
		href: RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.MAP]),
		_href: RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.MAP]),
		active: false,
		key: 'market'
	},
	{
		icon: 'eye',
		title: 'layout.footer.watchlist',
		activeIcon: 'eye_active',
		href: RouterMap.Watchlist.path,
		_href: RouterMap.Watchlist.path,
		active: false,
		key: 'watchlist'
	},
	{
		icon: 'building',
		title: 'layout.page-layout.portfolio',
		activeIcon: 'building_active',
		href: RouterMap.Portfolio.url([ RouterMap.Portfolio.SUMMARY ]),
		_href: RouterMap.Portfolio.url([ RouterMap.Portfolio.SUMMARY ]),
		active: false,
		key: 'portfolio'
	}
]

@Component({
	selector: 'app-footer-navigate',
	templateUrl: './footer-navigate.component.html',
	styleUrls: ['./footer-navigate.component.scss']
})
export class FooterNavigateComponent implements OnInit {
	@Output() clickPage: EventEmitter<string> = new EventEmitter()
	tabs = []

	os;
	constructor(
		private router: Router,
		public globalService: GlobalService,
		private settingsMiddleware: UserSettingsMiddlewareService,
		private tabsStatesService: TabsStatesService
	) {
		this.os = this.globalService.getMobileOperatingSystem()
		this.globalService.logOutEventListener$.next(true)
	}

	async ngOnInit() {
		this.tabs = TABS.filter(x => x.key !== 'portfolio')
		await this.settingsMiddleware.sync()
		const isDev = await this.settingsMiddleware.isDev()
		if (!isDev) {
			this.tabs = TABS.filter(nav => nav.key !== 'portfolio')
		}

		// Route enter and leave subscriptions
		this.tabsStatesService.leave$.subscribe(url => {
			if (url.includes(`/${RouterMap.Market.path}`) && !url.includes('redirect')) {
				const tab = this.tabs.find(x => x.key === 'market')
				tab.href = url
			}
			else if (url.includes(RouterMap.Watchlist.path)) {
				const tab = this.tabs.find(x => x.key === 'watchlist')
				tab.href = url
			}
		})

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map((event: NavigationEnd) => event.url),
		).subscribe((url) => {
			this.tabs.forEach(t => t.active = url.includes(`/${t.key}`))
		})

		this.tabs.forEach(t => t.active = this.router.url.includes(`/${t.key}`))

		this.globalService.menuClicked$
		.pipe(filter(res => !!res)).subscribe(
			res => {
				this.tabs.forEach(tab => {
					if (tab.key === res.key) {
						tab.href = res.href
					}
				})
			}
		)
	}

	openPage(tab) {
		// When the user click on the tab, then reset to default page
		if (this.router.url.includes(tab.key) && ['watchlist', 'market'].includes(tab.key)) {
			tab.href = tab._href
		}
		this.tabs.forEach(t => t.active = tab.href.includes(t.key))
		this.router.navigateByUrl(tab.href).then(res => {
			this.clickPage.emit(tab.key)
		})
	}

}
