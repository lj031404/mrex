import { Component, OnInit } from '@angular/core';
import { LineAreaChart } from '@app-models/chart.interface';

@Component({
  selector: 'app-line-chart-mock',
  templateUrl: './line-chart-mock.component.html',
  styleUrls: ['./line-chart-mock.component.scss']
})
export class LineChartMockComponent implements OnInit {
	lineAreaChartData: LineAreaChart
	equityBuiltChartData: LineAreaChart
	cashFlowChartData: LineAreaChart
	curIdxOfYear = 0
	curTab = 'total_gain'
	constructor() { }

	ngOnInit() {
		this.lineAreaChartData = this.generateChart('total_gain')
		this.equityBuiltChartData = this.generateChart('equity_built')
		this.cashFlowChartData = this.generateChart('cash_flow')
	}

	generateChart(categoryField: string) {
		return {
            id: categoryField,
			title: '',
			valueUnit: '$',
			categoryField: categoryField,
			graphData: this.getDataProvider(),
			valueFieldData: [
				{
					name: 'data_set_one',
					color: '#5CB09F',
					title: 'Data Set One'
				},
				{
					name: 'data_set_two',
					color: '#227967',
					title: 'Data Set Two'
				},
				{
					name: 'data_set_three',
					color: '#024134',
					title: 'Data Set Three'
				}
			]
		}
	}

	getDataProvider() {
		const chartData = [];
		const firstDate = new Date();
		firstDate.setDate(firstDate.getDate() - 100);

			let data_set_one = 2000;
			let data_set_two = 300;
			let data_set_three = 1000;
			let data_set_four = 140;


		for (let i = 0; i < 7; i++) {
			// we create date objects here. In your data, you can have date strings
			// and then set format of your dates using chart.dataDateFormat property,
			// however when possible, use date objects, as this will speed up chart rendering.
			const newDate = new Date(firstDate);
			newDate.setDate(newDate.getDate() + i);

			data_set_one += i * Math.floor((Math.random() * 100) + 1);
			data_set_two += i * Math.floor((Math.random() * 100) + 1);
			data_set_three += i * Math.floor((Math.random() * 100) + 1);
			data_set_four += i * Math.floor((Math.random() * 100) + 1);

			chartData.push({
				data_set_one: data_set_one,
				data_set_two: data_set_two,
				data_set_three: data_set_three,
				data_set_four: data_set_four,
				date: 1980 + i * 4,
				total_gain: `Gain${i}`,
				equity_built: `Equity${i}`,
				cash_flow: `Cash${i}`
			});
		}
		return chartData;
	}

	gotoPrevYear() {
		this.curIdxOfYear --
	}

	gotoPNextYear() {
		this.curIdxOfYear ++;
	}

}
