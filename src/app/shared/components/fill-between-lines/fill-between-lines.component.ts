import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { XYFillLineChart } from '@app-models/chart.interface';

@Component({
  selector: 'app-fill-between-lines',
  templateUrl: './fill-between-lines.component.html',
  styleUrls: ['./fill-between-lines.component.scss']
})
export class FillBetweenLinesComponent implements AfterViewInit {
    @Input() xyFillChartData: XYFillLineChart
    chart: AmChart
    constructor(
		private chartService: AmChartsService
    ) { }

    ngAfterViewInit() {
		if (this.xyFillChartData.graphData && this.xyFillChartData.graphData.length) {
			this.buildChart()
		}
	}

    buildChart() {
        this.chart = this.chartService.makeChart(this.xyFillChartData.id, {
            "type": "serial",
            "theme": "none",
            'addClassNames': true,
            'titles': [
				{
					'text': this.xyFillChartData.title,
					'size': 14,
					'color': '#00000080',
					'id': 'main'
				}
            ],
            'synchronizeGrid': true,

            "dataProvider": this.xyFillChartData.graphData,
            "valueAxes": [{
                "position": "left",
                'axisColor': '#5CB09F',
                'axisThickness': 2,
				'axisAlpha': 1,
				'gridThickness': 0,
				'unit': ` ${this.xyFillChartData.valueUnit}`,
				'fontSize': 14,
                'color': '#000000'
            }],
            "graphs": [{
                "id": "fromGraph",
                "lineAlpha": 0,
                "showBalloon": false,
                "valueField": "lineDown",
                "fillAlphas": 0,
                "fillColors": '#5cb09fb3'
            }, {
                "fillAlphas": 0.2,
                "fillToGraph": "fromGraph",
                "lineAlpha": 0,
                "showBalloon": false,
                "valueField": "lineTop",
                "fillColors": '#5cb09fb3'
            }, {
                "valueField": "value",
                "balloonText":"<div style='margin:10px; text-align:left'><span style='font-size:18px'>Value:[[value]]</span></div>",
                "fillAlphas": 0,
                'lineColor': '#5CB09F',
            }],
            "chartCursor": {
                "fullWidth": true,
                "cursorAlpha": 0.05,
                "valueLineEnabled":true,
                "valueLineAlpha":0.5,
                "valueLineBalloonEnabled":true
            },
            // "dataDateFormat": "YYYY-MM-DD",
            "categoryField": "year",
            "categoryAxis": {
                "position":"bottom",
                'axisColor': '#5CB09F',
                'minorGridEnabled': false,
                "parseDates": true,
                "axisAlpha": 0,
                "minHorizontalGap": 25,
                "gridAlpha": 0,
                "tickLength": 0,
            },

            "chartScrollbar":{
                "autoGridCount": true,
                "graph": "fromGraph",
                'enabled': true
            }
        });

    }
}
