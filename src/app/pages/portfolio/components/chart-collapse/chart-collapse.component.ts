import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { XYFillLineChart } from '@app/core/models/chart.interface';
import { ChartTypes } from '@app-core/models/chartType.enum';
@Component({
	selector: 'app-chart-collapse',
	templateUrl: './chart-collapse.component.html',
	styleUrls: ['./chart-collapse.component.scss']
})
export class ChartCollapseComponent implements OnInit, OnChanges {
	ChartTypes = ChartTypes
	expanded: boolean = false
	@Input() chartData
	@Input() label: string
	@Input() value: any
	@Input() showData?: boolean = true
	@Input() chartType?: string = ChartTypes.FILL_BETWEEN_LINES
	constructor() { }

	ngOnInit() {
	}

	ngOnChanges(data) {
	}

}
