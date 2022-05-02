import { Component, OnInit, Input } from '@angular/core';
import { SalesComparison } from '@app-models/sales_comparison.interface'

@Component({
	selector: 'app-sales-comparison-overview',
	templateUrl: './sales-comparison-overview.component.html',
	styleUrls: ['./sales-comparison-overview.component.scss']
})
export class SalesComparisonOverviewComponent implements OnInit {
	@Input() salesComparison: SalesComparison
	constructor() { }

	ngOnInit() {
	}

}
