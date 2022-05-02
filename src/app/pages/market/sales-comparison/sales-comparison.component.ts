import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesComparison } from '@app-models/sales_comparison.interface'
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service';
import { MarketPropertyComparable, MarketService } from '@app/api_generated';
import { ModalRef } from '@app/core/models/modal-ref';
import { RouterMap } from '@app/core/utils/router-map.util';
import { LayoutService } from '@app/layout/service/layout.service';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-sales-comparison',
	templateUrl: './sales-comparison.component.html',
	styleUrls: ['./sales-comparison.component.scss']
})
export class SalesComparisonComponent implements OnInit {
	@Input() modalRef: ModalRef
	@Input() data: any = {}
	salesComparison: SalesComparison
	emptyProps = ['', '', '', '', ''] 
	propertyId

	constructor(
		private marketMiddlewareService: MarketMiddlewareService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	async ngOnInit() {
		this.propertyId = this.route.snapshot.paramMap.get('propertyId') || this.data.propertyId
		await this.getPropertyComparable()
	}

	async getPropertyComparable() {
		this.salesComparison = await this.marketMiddlewareService.getPropertyComparable(this.propertyId)
	}

	back() {
		this.router.navigateByUrl(this.router.url.split('/comparables')[0])
	}
}
