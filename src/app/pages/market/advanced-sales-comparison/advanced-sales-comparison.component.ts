import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service';
import { MarketPropertyComparableDetails } from '@app/api_generated';
import { XYLineChart } from '@app/core/models/chart.interface';
import { ModalRef } from '@app/core/models/modal-ref';
import { forkJoin, of } from 'rxjs';
import { catchError, flatMap, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { LayoutService } from '@app/layout/service/layout.service';
import { MarketService as MarketApiService } from '@app/api_generated/api/market.service'
import { SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';
import { SwiperOptions } from 'swiper';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { RouterMap } from '@app/core/utils/router-map.util';
import * as moment from 'moment';

@Component({
	selector: 'app-advanced-sales-comparison',
	templateUrl: './advanced-sales-comparison.component.html',
	styleUrls: ['./advanced-sales-comparison.component.scss']
})
export class AdvancedSalesComparisonComponent implements OnInit {
	@Input() modalRef: ModalRef
	@Input() data: any = {}
	@ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;
	@ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;

	advancedSalesComparison: MarketPropertyComparableDetails
	listing = []
	xyChartData: XYLineChart
	xyChartDataWithNoBeta: XYLineChart
	kpis = [
		{ label: "caprate", value: 3.275386736059665, amount: 246248 },
		{ label: "pricePerDoor", value: 240896, amount: 209870 },
		{ label: "avgRent", value: 752, amount: 233687 }
	]
	public config: SwiperOptions = {
		a11y: { enabled: true },
		direction: 'horizontal',
		slidesPerView: 1,
		keyboard: true,
		mousewheel: true,
		scrollbar: false,
		navigation: false,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			hideOnClick: false
		}
	};
	index = 0
	propertyId
	comparablePropertyId
	comparables = []
	property

	constructor(
		private marketMiddleWareService: MarketMiddlewareService,
		private layoutService: LayoutService,
		private route: ActivatedRoute,
		public spinnerService: SpinnerService,
		private marketApiService: MarketApiService,
		private translate: TranslateService,
		private router: Router
	) {
	}

	ngOnInit() {
		this.route.paramMap.subscribe(async (parm) => {
			this.propertyId = this.route.snapshot.paramMap.get('propertyId') || this.data.propertyId
			this.comparablePropertyId = this.route.snapshot.paramMap.get('comparablePropertyId') || this.data.comparable.id

			const comparison = await this.marketMiddleWareService.getPropertyComparable(this.propertyId)
			this.property = await this.marketMiddleWareService.getProperty(this.propertyId)

			this.property = {
				...this.property,
				coordinates: this.property.address.coordinates,
				images: this.property.pictures
			}

			if (comparison && comparison.comparables) {
				this.comparables = comparison.comparables.map((comparable, idx) => ({
					...comparable,
					idx
				}))
			}

			if (this.propertyId) {
				this.getAdvancedSalesComparison(this.comparablePropertyId)
			}
		})

	}

	async getAdvancedSalesComparison(comparablePropertyId: string) {
		this.spinnerService.show()
		this.spinnerService.text = ''
		try {
			const res = await this.marketMiddleWareService.getAdvancedSalesComparison(this.propertyId, comparablePropertyId)
			if (res && res.length) {
				this.advancedSalesComparison = res[0]

				this.xyChartData = this.generateMockData()
				this.xyChartDataWithNoBeta = {
					...this.generateMockData(),
					title: '',
					isShowBeta: false,
					id: 'xyChartV2'
				}
			}
			this.spinnerService.hide()
		}
		catch (err) {
			console.error(err)
			this.spinnerService.hide()
		}
	}

	generateMockData(): XYLineChart {
		const graphData = Object.keys(this.advancedSalesComparison.comparableCapRates).map(id => {
			return {
				year: moment(this.advancedSalesComparison.comparableCapRates[id]['date']).format('YYYY'),
				value: +this.advancedSalesComparison.comparableCapRates[id]['value'].toFixed(2)
			}
		})
		return {
			id: 'xyChartV1',
			title: '',
			isShowBeta: false,
			valueUnit: '%',
			graphData
		}
	}

	public onIndexChange(index: number): void {
		this.index = index
	}

	public onSwiperEvent(event: string): void {
		const currentComparison = this.comparables[this.index]
		this.router.navigateByUrl(RouterMap.Market.url([RouterMap.Market.PROPERTIES, this.propertyId, RouterMap.Market.SALES_COMPS, currentComparison.id]))

	}

	back() {
		this.router.navigateByUrl(this.router.url.split('/comparables')[0] + '/comparables')
	}

	changeActivity(comp) {
		comp.isChecked = !comp.isChecked
		const ignoreList = this.comparables.filter(comparable => !comparable.isChecked).map(comparable => comparable.id)
		this.spinnerService.show()
		this.spinnerService.text = ''
		this.marketApiService.getPropertyComparables(this.propertyId, ignoreList).pipe(
			take(1),
			map(async (res) => {
				return await this.marketMiddleWareService.getPropertyComparable(this.propertyId, true)
			}),
			catchError(() => {
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
				this.spinnerService.hide()
				return of(null)
			})
		).subscribe(res => {
			this.spinnerService.hide()
		})

	}

}
