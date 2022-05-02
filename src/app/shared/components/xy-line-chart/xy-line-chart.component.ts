import { Component, Input, AfterViewInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import * as _ from 'lodash';
import { XYLineChart } from '@app-models/chart.interface';
@Component({
  selector: 'app-xy-line-chart',
  templateUrl: './xy-line-chart.component.html',
  styleUrls: ['./xy-line-chart.component.scss']
})
export class XyLineChartComponent implements AfterViewInit {
	@Input() xyChartData: XYLineChart
	chart: AmChart
	constructor(
		private chartService: AmChartsService
	) { }

	ngAfterViewInit() {
		if (this.xyChartData && this.xyChartData.graphData && this.xyChartData.graphData.length) {
			this.buildChart()
		}
	}

	buildChart() {
		this.chart = this.chartService.makeChart(this.xyChartData.id, {
			'type': 'serial',
			'theme': 'none',
			'addClassNames': true,
			'titles': [
				{
					'text': this.xyChartData.title,
					'size': 14,
					'color': '#00000080',
					'id': 'main'
				}
			],
			'dataProvider': this.generateChartData(),
			'synchronizeGrid': true,
			'valueAxes': [{
				'id': 'v1',
				'axisColor': '#5CB09F',
				'axisThickness': 2,
				'axisAlpha': 1,
				'position': 'left',
				'gridThickness': 0,
				'unit': ` ${this.xyChartData.valueUnit}`,
				'fontSize': 14,
				'color': '#000000'
			}],
			'graphs': this.xyChartData.isShowBeta ? [{
				'valueAxis': 'v1',
				'lineColor': '#5CB09F',
				'bullet': 'round',
				'bulletBorderThickness': 2,
				'hideBulletsCount': 30,
				'valueField': 'value',
				'balloonText': `[[value]][[valueUnit]] <span class='[[labelColor]]'>(<span style='color: [[labelColor]]'>[[betaData]]<span>)</span>`,
				'fillAlphas': 0,
				'lineThickness': 2,
				'bulletSize': 12,
				'gridThickness': 0,
			}] : [{
				'valueAxis': 'v1',
				'lineColor': '#5CB09F',
				'bullet': 'round',
				'bulletBorderThickness': 2,
				'hideBulletsCount': 30,
				'valueField': 'value',
				'balloonText': `[[value]][[valueUnit]]`,
				'fillAlphas': 0,
				'lineThickness': 2,
				'bulletSize': 12,
				'gridThickness': 0,
			}] ,
			'chartScrollbar': {
				'enabled': false
			},
			'chartCursor': {
				'cursorAlpha': 0.1,
				'cursorColor': '#000000',
				'fullWidth': true,
				'valueBalloonsEnabled': false,
				'zoomable': false
			},
			'categoryField': 'year',
			'gridColor': '#ffffff',
			'gridAlpha': 0.1,
			'categoryAxis': {
				'axisColor': '#5CB09F',
				'minorGridEnabled': false,
				'axisThickness': 2,
				'gridThickness': 0,
				'fontSize': 12,
				'color': '#000000'

			}
		})
	}

	generateChartData() {

		return this.xyChartData.graphData.map((data, index) => {
			return this.xyChartData.isShowBeta ? {
				...data,
				max: _.maxBy(this.xyChartData.graphData, 'value').value + _.maxBy(this.xyChartData.graphData, 'value').value * 0.2,
				betaData1: !index ? 0 : parseInt(((data.value - this.xyChartData.graphData[index - 1].value ) / data.value * 100).toFixed(1), 10),
				betaData: !index ? '' : data.betaData ? data.betaData > 0 ? `+${data.betaData}%` : `${data.betaData}%` : '0%',
				labelColor: !index ? 'hide-ballon' : data.betaData > 0 ? '#5CB09F' :  data.betaData < 0 ? '#ff0000' : '#e61515',
				valueUnit: this.xyChartData.valueUnit
			} : {
				...data,
				valueUnit: this.xyChartData.valueUnit
			}
		})
	}

}
