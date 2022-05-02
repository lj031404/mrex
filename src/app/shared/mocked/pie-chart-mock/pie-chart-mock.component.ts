import { Component, OnInit } from '@angular/core';
import { PieChart } from '@app-models/chart.interface';

@Component({
  selector: 'app-pie-chart-mock',
  templateUrl: './pie-chart-mock.component.html',
  styleUrls: ['./pie-chart-mock.component.scss']
})
export class PieChartMockComponent implements OnInit {
	pieChart: PieChart
	constructor() { }

	ngOnInit() {
	    this.pieChart = this.buildChartData()
	}

	buildChartData() {
		return {
			id: 'pieChart1',
			valueUnit: '$',
			graphData: [{
				title: 'Data Set One',
				value: 2300.84,
				color: '#5CB09F'
				}, {
				title: 'Data Set Two',
				value: 2500.84,
				color: '#36FAD1'
				}, {
				title: 'Data Set Three',
				value: 2100.84,
				color: '#024134'
				}, {
				title: 'Data Set Four',
				value: 4100.84,
				color: '#227967'
			}]
		}
	}

}
