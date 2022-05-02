import { Component, OnInit } from '@angular/core';
import { StackChart } from '@app-models/chart.interface';

@Component({
  selector: 'app-histogram-chart-mock',
  templateUrl: './histogram-chart-mock.component.html',
  styleUrls: ['./histogram-chart-mock.component.scss']
})
export class HistogramChartMockComponent implements OnInit {
  stackChart: StackChart
  constructor() { }

  ngOnInit() {
		this.stackChart = this.generateData()
  }

  generateData() {
	return {
		id: 'stackV1',
		valueUnit: '$',
		categoryField: 'year',
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
		],
		graphData: this.getDataProvider()

	}
  }

  getDataProvider() {
	const chartData = [];

	let data_set_one = 2000;
	let data_set_two = 300;
	let data_set_three = 1000;
	let data_set_four = 0;
	for (let i = 0; i < 7; i++) {
		// we create date objects here. In your data, you can have date strings
		// and then set format of your dates using chart.dataDateFormat property,
		// however when possible, use date objects, as this will speed up chart rendering.

		data_set_one += i * 100;
		data_set_two += i * 100;
		data_set_three -= i * 10;
		data_set_four += i * 200;

		chartData.push({
			data_set_one: data_set_one,
			data_set_two: data_set_two,
			data_set_three: data_set_three,
			total: data_set_one + data_set_two + data_set_three,
			year: 1980 + i * 4
		});
	}
	return chartData;
}

}
