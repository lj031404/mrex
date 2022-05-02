import { Component, OnInit, Input } from '@angular/core';
import { SalesComparison } from '@app-models/sales_comparison.interface'
import { MarketService as MarketApiService } from '@app/api_generated/api/market.service'
import { catchError, flatMap, map, take } from 'rxjs/operators';
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { of } from 'rxjs';
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';

@Component({
	selector: 'app-sales-comparables',
	templateUrl: './sales-comparables.component.html',
	styleUrls: ['./sales-comparables.component.scss']
})
export class SalesComparablesComponent implements OnInit {
	@Input() salesComparison: SalesComparison
	@Input() propertyId: string
	constructor(
		private marketApiService: MarketApiService,
		private marketMiddleWareService: MarketMiddlewareService,
		private spinnerService: SpinnerService,
		private layoutService: LayoutService,
		private translate: TranslateService,
		private router: Router,
	) { }

	ngOnInit() {
	}

	changeActivity(comp) {
		comp.isChecked = !comp.isChecked
		const ignoreList = this.salesComparison.comparables.filter(comparable => !comparable.isChecked).map(comparable => comparable.id)
		this.spinnerService.show()
		this.spinnerService.text = ''
		this.marketApiService.getPropertyComparables(this.propertyId, ignoreList).pipe(
			take(1),
			map(async (res) => {
				return this.marketMiddleWareService.getPropertyComparable(this.propertyId, true)
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

	openAdvancedSalesComps(comparable) {
		console.log('propertyId', this.propertyId)
		console.log('ADVANCED===>', RouterMap.Market.url([RouterMap.Market.PROPERTIES, this.propertyId, RouterMap.Market.SALES_COMPS, comparable.id]))

		this.router.navigateByUrl(RouterMap.Market.url([RouterMap.Market.PROPERTIES, this.propertyId, RouterMap.Market.SALES_COMPS, comparable.id]))
	}

}
