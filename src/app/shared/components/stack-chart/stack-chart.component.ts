import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { StackChart } from '@app-models/chart.interface';

@Component({
  selector: 'app-stack-chart',
  templateUrl: './stack-chart.component.html',
  styleUrls: ['./stack-chart.component.scss']
})
export class StackChartComponent implements AfterViewInit {
	chart: AmChart
	@Input() stackChart: StackChart
	constructor(
		private chartService: AmChartsService
	) { }

	ngAfterViewInit() {
		if (this.stackChart.valueFieldData.length && this.stackChart.graphData.length) {
			this.buildChart()
		}
	}

	buildChart() {
		this.chart = this.chartService.makeChart(this.stackChart.id, {
			'type': 'serial',
			'theme': 'none',
			'addClassNames': true,
			'legend': {
				'horizontalGap': 10,
				'maxColumns': 1,
				'position': 'bottom',
				'useGraphSettings': true,
				'markerSize': 10
			},
			'dataProvider': this.stackChart.graphData,
			'valueAxes': [{
				'stackType': 'regular',
				'axisColor': '#000000',
				'axisThickness': 1,
				'axisAlpha': 1,
				'position': 'left',
				'unit': ` ${this.stackChart.valueUnit}`,
				'fontSize': 12
			}],
			'graphs': this.getGraphs(),
			'categoryField': this.stackChart.categoryField,
			'categoryAxis': {
				'gridPosition': 'start',
				'axisColor': '#000000',
				'minorGridEnabled': true,
				'fontSize': 12,
				'color': '#000000',
				'axisThickness': 1,
				'gridThickness': 1,
			}
		})
	}

	getGraphs() {
		const graphs = this.stackChart.valueFieldData.map(data => ({
			balloonText: '<b>[[title]]</b><br><span style=\'font-size:14px\'>[[category]]: <b>[[value]]</b></span>',
			fillAlphas: 1,
			// labelText: '[[value]]',
			lineAlpha: 0,
			title: data.title,
			type: 'column',
			valueField: data.name,
			fillColors: data.color,
			color: '#000000',
			bullet: '',
			bulletSize: 0
		}))

		graphs.push({
			balloonText: '<span style=\'font-size:14px\'>[[title]]: <b>[[value]]</b></span>',
			fillAlphas: 0,
			// labelText: '[[value]]',
			lineAlpha: 1,
			bullet: 'round',
			title: 'Totoal',
			type: 'line',
			valueField: 'total',
			fillColors: '',
			color: '#000000',
			bulletSize: 3
		})
		return graphs
	}



}
