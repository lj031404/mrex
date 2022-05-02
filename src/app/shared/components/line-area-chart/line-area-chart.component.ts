import { Component, Input, AfterViewInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { LineAreaChart } from '@app-models/chart.interface';

@Component({
  selector: 'app-line-area-chart',
  templateUrl: './line-area-chart.component.html',
  styleUrls: ['./line-area-chart.component.scss']
})
export class LineAreaChartComponent implements AfterViewInit {
	@Input() lineAreaChartData: LineAreaChart
	chart: AmChart
	constructor(
		private chartService: AmChartsService
	) { }

	ngAfterViewInit() {
		if (this.lineAreaChartData && this.lineAreaChartData.graphData.length) {
			this.buildChart()
		}
	}

	buildChart() {
		this.chart = this.chartService.makeChart(this.lineAreaChartData.id, {
			'type': 'serial',
			'addClassNames': true,
			'theme': 'none',
			'legend': {
				'equalWidths': false,
				'valueAlign': 'left',
				'valueWidth': 120
			},
			'dataProvider': this.lineAreaChartData.graphData,
			'valueAxes': [{
				'id': 'data_set_one',
				'axisColor': '#000000',
				'axisThickness': 1,
				'axisAlpha': 1,
				'position': 'left',
				'unit': ` ${this.lineAreaChartData.valueUnit}`,
				'fontSize': 12,
			}],
			'graphs': this.getGraphs(),
			'chartScrollbar': {
			'enabled': false
			},
			'chartCursor': {
			/* "cursorPosition": "mouse" */
			},
			'dataDateFormat': 'YYYY',
			'categoryField': this.lineAreaChartData.categoryField,
			'categoryAxis': {
				'axisColor': '#000000',
				'minorGridEnabled': true,
				'fontSize': 12,
				'color': '#000000',
				'axisThickness': 1,
				'gridThickness': 1,
				'parseDates': this.lineAreaChartData.categoryField === 'date' ? true : false,
				'autoGridCount': false,
				'gridCount': 5,
				'startOnAxis': true
			}
		})
	}

	getGraphs() {
		const graphData =  this.lineAreaChartData.valueFieldData.map(data => ({
			valueAxis: data.name,
			lineColor: data.color,
			title: data.title,
			valueField: data.name,
			fillAlphas: 1,
			hideBulletsCount: 30,
			legendPeriodValueText: 'total: [[value.sum]] $',
			legendValueText: '[[value]] $',
		}))
		return graphData
	}
}
