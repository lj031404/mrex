import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ListedProperty } from '@app-models/home.interface';
import { RouterMap } from '@app/core/utils/router-map.util'
import { HomeService as ApiHomeSevice } from '@app/api_generated/api/home.service';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '@app/layout/service/layout.service';
import * as _ from 'lodash'
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { filter } from 'rxjs/operators';

import { Router } from '@angular/router';
@Component({
	selector: 'app-home-properties',
	templateUrl: './home-properties.component.html',
	styleUrls: ['./home-properties.component.scss']
})
export class HomePropertiesComponent implements OnInit, OnDestroy, OnChanges {
	@Input() property: ListedProperty;
	@Input() currentTab: string = ''
	@Output() scrollEmitter: EventEmitter<{key: string, scroll: number}> = new EventEmitter()

	@ViewChild('content', { static: true }) content: ElementRef
	RouterMap = RouterMap
	constructor(
		private apiHomeSevice: ApiHomeSevice,
		private translate: TranslateService,
		private layoutService: LayoutService,
		private tabsStatesService: TabsStatesService,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	ngOnInit() {
		window.addEventListener("scroll", this.scrollHandler.bind(this), true)

		// Route enter and leave subscriptions
		this.tabsStatesService.enter$.pipe(filter(url => url.includes(RouterMap.Home.path))).subscribe(() => {
			const state = this.tabsStatesService.get('home-' + this.property.key)
			if (state) {
				this.content.nativeElement.scrollTo(state, 0)
			}
		})
		
	}

	ngOnChanges() {
		if (this.currentTab !== 'properties') {
			window.removeEventListener("scroll", this.scrollHandler.bind(this), true);
		}
	}

	scrollHandler() {
		const target = document.getElementsByClassName(this.property.key)[0]
		if (this.currentTab === 'properties' && target) {
			const offsetWidth = document.getElementsByClassName(this.property.key)["0"].offsetWidth;
			
			if (!this.property.disableLoadMore && !this.property.loading && (offsetWidth + target.scrollLeft + 320 * 4 >= target.scrollWidth) && this.property.list.length >= 5) {
				if (this.property.key === 'recentListings') {
					this.getMoreRecentlListings()
				}
				else if (this.property.key === 'watchlistProperties') {
					this.getMoreWatchList()
				}
				else if (this.property.key === 'recentlySold') {
					this.getMoreRecentlySold()
				}
			}
		}
	}

	onScroll(event: any) {
		this.scrollEmitter.emit({ key: this.property.key, scroll: event.target.scrollLeft})
	}

	getMoreRecentlySold() {
		this.property.loading = true
		this.apiHomeSevice.getRecentlySold(this.property.loadMoreCount * 5, 5).subscribe(
			res => {
				this.property.list = _.uniqBy([...this.property.list, ...res], 'id');
				this.property.list.forEach((item: any) => {
					item.link = RouterMap.Market.url([RouterMap.Market.PROPERTIES, item.propertyId])
					item.queryParams = { redirect: RouterMap.Home.path }
				})
				console.dir(this.property.list)
				this.property.loading = false
				this.property.loadMoreCount ++
	      		this.property.disableLoadMore = res.length < 5
				  this.changeDetectorRef.detectChanges()
			}, err => {
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
				this.property.loading = false
			}
		)
	}

	getMoreRecentlListings() {
		this.property.loading = true
		this.apiHomeSevice.getRecentListings(this.property.loadMoreCount * 5, 5).subscribe(res => {
			this.property.list = _.uniqBy([...this.property.list, ...res], 'id');
			this.property.list.forEach((item: any) => {
				item.link = RouterMap.Market.url([RouterMap.Market.PROPERTIES, item.propertyId])
				item.queryParams = { redirect: RouterMap.Home.path }
			})
			this.property.loading = false
			this.property.loadMoreCount ++
      		this.property.disableLoadMore = res.length < 5
			  this.changeDetectorRef.detectChanges()
		}, err => {
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			this.property.loading = false
		})
	}

	getMoreWatchList() {
		this.property.loading = true
		this.apiHomeSevice.getWatchlistProperties(this.property.loadMoreCount * 5, 5).subscribe(res => {
			this.property.list = _.uniqBy([...this.property.list, ...res], 'propertyId');
			this.property.list.forEach((item: any) => {
				item.link = RouterMap.Market.url([RouterMap.Market.PROPERTIES, item.propertyId])
				item.queryParams = { redirect: RouterMap.Home.path }
			})
			this.property.loading = false
			this.property.loadMoreCount ++
      		this.property.disableLoadMore = res.length < 5
			  this.changeDetectorRef.detectChanges()
		}, err => {
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			this.property.loading = false
		})
	}

	openWatchList() {
		this.router.navigate([RouterMap.Watchlist.path])
	}

	ngOnDestroy() {
		window.removeEventListener("scroll", this.scrollHandler.bind(this), true);
	}
}
