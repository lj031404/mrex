import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AppNumberPipe } from '@app-pipes/number.pipe';
import { TranslateService } from '@ngx-translate/core';

export interface TableColumnInterface {
	name: string
	pipe?: {
		pipe: AppNumberPipe
		args?: any
	},
	isEstimated?: boolean
}

@Component({
	selector: 'app-market-data-table',
	templateUrl: './market-data-table.component.html',
	styleUrls: ['./market-data-table.component.scss']
})
export class MarketDataTableComponent implements OnInit {
	@Input() columns: (string | TableColumnInterface)[]
	@Input() data: any

	_columns: TableColumnInterface[]
	_columnNames: string[]
	estimatedTooltip

	constructor(
		private translate: TranslateService
	) { }

	ngOnInit() {
		this._columnNames = []
		this._columns = (this.columns || []).map(column => {
			if (typeof column === 'string') {
				this._columnNames.push(column)
				return { name: column }
			}
			this._columnNames.push(column.name)
			return column
		})

		this.estimatedTooltip = this.translate.instant('pages.market_data_table.estimated')
	}
}
