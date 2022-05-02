import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

export interface DataInterface {
	label: string
	key?: string
	values: object
}

@Component({
	selector: 'app-financing-chart',
	templateUrl: './financing-chart.component.html',
	styleUrls: ['./financing-chart.component.scss']
})
export class FinancingChartComponent implements OnInit, OnChanges, OnDestroy {

	@Input() data: Observable<any[]>
	@Input() staticData: DataInterface[]

	_data: DataInterface[] = []

	subscriptions = true

	constructor() { }

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.data) {
			this.data.pipe(
				map(items => {
					if (!items) {
						return
					}
					return items.map((item: any) => {
						const values = item.values || {}
						const valueKeys = Object.keys(values)

						return {
							label: item.label,
							values: valueKeys.map(key => ([
								key,
								... values[key]
							]))
						}
					})
				}),
				takeWhile(() => this.subscriptions)
			)
			.subscribe(data => {
				this._data = data
			})
		} else if (this.staticData) {
			this._data = this.staticData.map(item => {
				const values = item.values || {}
				const valueKeys = Object.keys(values)

				return {
					label: item.label,
					values: valueKeys.map(key => ([
						key,
						... values[key]
					]))
				}
			})
		}
	}

	ngOnDestroy() {
		this.subscriptions = false
	}
}
