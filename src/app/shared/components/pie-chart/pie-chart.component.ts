import { Component, Input, AfterViewInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { PieChart } from '@app-models/chart.interface';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {
	@Input() pieChart: PieChart
	chart: AmChart
	defaultColors = ['#5CB09F', '#227967', '#024134', '#36FAD1', '#000000', '#CCCCCC']

	constructor(
		private chartService: AmChartsService
	) { }

	ngAfterViewInit() {
		if (this.pieChart.graphData && this.pieChart.graphData.length) {
			this.buildChart()
		}
	}

	buildChart() {
		this.chart = this.chartService.makeChart(this.pieChart.id, {
			'type': 'pie',
			'theme': 'none',
			'addClassNames': true,
			'legend': {
                'horizontalGap': 10,
				'markerSize': 10,
				'data': this.pieChart.graphData.map(item => ({
					'title': item.title,
					'value': Math.round(item.value) + ' ' + this.pieChart.valueUnit,
					'color': item.color
				}))
			},
			'dataProvider': this.pieChart.graphData,
			'titleField': 'title',
			'valueField': 'value',
			'labelRadius': 5,
			'radius': '42%',
			'innerRadius': '60%',
			'labelText': '',
			'colorField': 'color',
			'startDuration': 0,
			'balloonText': `[[title]]: [[percents]]% ([[value]]${this.pieChart.valueUnit})`,
		})
	}

}
