import { Component, OnInit, ViewChild } from '@angular/core';
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service';
import { MarketService } from '@app/api_generated';
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';

import { SpinnerService } from '@app/shared/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
import { MarketinfoshareService } from '../adapter/marketinfoshare.service';
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { filter } from 'rxjs/operators';
@Component({
	selector: 'app-market-saved',
	templateUrl: './market-saved.component.html',
	styleUrls: ['./market-saved.component.scss']
})
export class MarketSavedComponent implements OnInit {
	savedSearchData: Array<any>
	emptyProp = ['', '', '', '', '', '', '', '', '', '']
	savedSearchId: string
	address

	@ViewChild('content', { static: true}) content 

	constructor(
		private marketMiddlewareService: MarketMiddlewareService,
		private layoutService: LayoutService,
		private translate: TranslateService,
		private marketService: MarketService,
		private spinnerService: SpinnerService,
		private router: Router,
		private route: ActivatedRoute,
		private infoService: MarketinfoshareService,
		private tabsStatesService: TabsStatesService
	) { }

	async ngOnInit() {
		this.getSavedSearchData()
		this.savedSearchId = this.route.snapshot.paramMap.get('savedSearchId')

		this.savedSearchData = this.address ? this.marketMiddlewareService.savedSearchData.filter(item => item.address === this.address) : this.marketMiddlewareService.savedSearchData

		this.infoService.inputSearchAddress$.subscribe(res => {
			this.address = res
			this.savedSearchData = this.address ? this.marketMiddlewareService.savedSearchData.filter(item => item.address === this.address) : this.marketMiddlewareService.savedSearchData
		})

		// Route enter and leave subscriptions
		this.tabsStatesService.enter$.pipe(filter(url => url.includes(RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.SAVED])))).subscribe(url => {
			this.content.nativeElement.scrollTo(0, this.tabsStatesService.get('market-saved'))
		})

		this.tabsStatesService.leave$.pipe(filter(url => url.includes(RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.SAVED])))).subscribe(url => {
			this.tabsStatesService.save('market-saved', this.content.nativeElement.scrollTop)
		})
	}

	async getSavedSearchData(fetchApi = false) {
		try {
			let savedSearchData = await this.marketMiddlewareService.getSavedSearchData(fetchApi)
			setTimeout(() => {
				if (savedSearchData) {
					this.savedSearchData = this.address ? this.marketMiddlewareService.savedSearchData.filter(item => item.address === this.address) : this.marketMiddlewareService.savedSearchData
				}
			}, 300)
		} catch (error) {
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
		}

	}

	navigateToMarketList(id: string) {
		this.marketMiddlewareService.saveActiveTab(RouterMap.Market.LIST)

		this.router.navigate([RouterMap.Market.path, RouterMap.Market.OVERVIEW, RouterMap.Market.LIST], {
			queryParams: {
				search: id
			}
		})
	}

	async onDelete(id: string) {
		try {
			this.spinnerService.show()
			this.spinnerService.text = ''

			this.savedSearchData = this.savedSearchData.filter(item => item.id !== id)
			await this.marketService.deleteSearchHistoryItem(id).toPromise()
			await this.getSavedSearchData(true)

			this.spinnerService.hide()
		} catch (error) {
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
		}
	}

}
