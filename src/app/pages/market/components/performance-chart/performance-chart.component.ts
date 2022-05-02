import { Component, Input, OnInit } from '@angular/core';

interface DataInterface {
	year: number
	amount: number
	increase?: number
	decrease?: number
}

@Component({
	selector: 'app-performance-chart',
	templateUrl: './performance-chart.component.html',
	styleUrls: ['./performance-chart.component.scss']
})
export class PerformanceChartComponent implements OnInit {
	@Input() data: any[]

	_data: DataInterface[] = []
	_maxIncrease = 0
	_maxDecrease = 0

	constructor() { }

	ngOnInit() {
		this._data = this.data.map(item => ({
			...item
		})).sort((a, b) => b.year - a.year)

		this.handleData()
	}

	handleData() {
		this._data.forEach(item => {
			if (item.increase > this._maxIncrease) {
				this._maxIncrease = item.increase
			}
			if (item.decrease > this._maxDecrease) {
				this._maxDecrease = item.decrease
			}
		})

		if (!this._maxIncrease) {
			this._maxIncrease = 1
		} else {
			this._maxIncrease = this._maxIncrease
		}
		if (!this._maxDecrease) {
			this._maxDecrease = 1
		} else {
			this._maxDecrease = this._maxDecrease
		}
	}
}
