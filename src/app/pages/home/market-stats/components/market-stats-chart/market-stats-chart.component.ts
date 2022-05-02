import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import moment from 'moment';
import * as _ from 'lodash'
import 'moment-locale-fr';
import { I18nService } from '@app/core/services/i18n.service';

@Component({
    selector: 'app-market-stats-chart',
    templateUrl: './market-stats-chart.component.html',
    styleUrls: ['./market-stats-chart.component.scss']
})
export class MarketStatsChartComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() id: string
    @Input() chartData
    @Input() type
    chart: AmChart
    constructor(
        private chartService: AmChartsService,
        private i18nService: I18nService
    ) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
       this.buildChartData()
    }

    ngOnChanges() {
        if (this.chart) {
            this.buildChartData()
        }
    }

    buildChartData() {
        const current = this.i18nService.language
        if (this.id && this.chartData) {
            const fields = Object.keys(this.chartData)
            const chartData = fields.map(field => this.chartData[field])
            if (chartData && chartData.length) {
                chartData.forEach((chart, index) => {
                    chart.forEach(item => {
                        item[fields[index]] = item.y
                        item['x'] = this.type === 'timeSerie' ? 
                            current === 'en-US' ? this.capitalizeFirstLetter(moment(item.x).locale('en').format('MMM DD YY')) :  this.capitalizeFirstLetter(moment(item.x).locale('fr').format('MMM DD YY')) : 
                             item.x
                    });
                })
                const mergedData = _([]).concat(_.flattenDeep(chartData)).groupBy("x").map(_.spread(_.merge)).value()
                if (this.id === 'averageDaysonMarketChart') {
                    const valueAxes = [
                        {
                            'axisColor': '#5CB09F',
                            "id": "medianPriceAxis",
                            'axisThickness': 2,
                            'axisAlpha': 1,
                            "gridAlpha": 0,
                            "position": "left",
                            'gridThickness': 0,
                            'unit': '$'
                        }
                    ]

                    const graphs = [
                        {   "id": "fromGraph",
                            "valueAxis": "daysOnMarketAxis",
                            'lineColor': '#349e8933',
                            'fixedColumnWidth': 1,
                            "type": "column",
                            "fillAlphas": 0.7,
                            "valueField": "daysOnMarket",
                            "balloonText": current === 'en-US' ? "[[value]] on market" : "[[value]] sur le marché",
                        },
                        {
                            "dashLengthField": "dashLength",
                            "fillAlphas": 0,
                            "valueField": "medianPrice",
                            "valueAxis": "medianPriceAxis",
                            'lineColor': '#349E89',
                            "balloonText": "$[[value]]",
                        }
                    ]


                    this.buildChart(mergedData, graphs, valueAxes)
                }

                if (this.id === 'soldActiveListings') {
                    const valueAxes = [
                        {
                            'axisColor': '#5CB09F',
                            "id": "totalSold",
                            'axisThickness': 2,
                            'axisAlpha': 1,
                            "gridAlpha": 0,
                            "position": "left",
                            'gridThickness': 0,
                        }
                    ]

                    const graphs = [
                        {   "id": "fromGraph",
                            'lineColor': '#349e8933',
                            'fixedColumnWidth': 1,
                            "type": "column",
                            "fillAlphas": 0.7,
                            "valueField": "activeListings",
                            "balloonText": current === 'en-US' ? "[[value]] active listings" : "[[value]] listes actives",
                        },
                        {
                            "dashLengthField": "dashLength",
                            "fillAlphas": 0,
                            "valueField": "totalSold",
                            'lineColor': '#349E89',
                            "balloonText": current === 'en-US' ? "[[value]] total sold" : "[[value]] total vendu",
                        },
                        {
                            "dashLengthField": "dashLength",
                            "fillAlphas": 0,
                            "valueField": "newListings",
                            'lineColor': '#000',
                            "balloonText": current === 'en-US' ? "[[value]] new listings" : "[[value]] nouvelles inscriptions",
                        }
                    ]

                    this.buildChart(mergedData, graphs, valueAxes)
                }

                if (this.id === 'soldPriceDistribution') {
                    const valueAxes = [
                        {
                            'axisColor': '#5CB09F',
                            "id": "soldPriceDistribution",
                            'axisThickness': 2,
                            'axisAlpha': 1,
                            "gridAlpha": 0,
                            "position": "left",
                            'gridThickness': 0,
                        }
                    ]

                    const graphs = [
                        {   "id": "fromGraph",
                            'lineColor': '#349e8933',
                            'fixedColumnWidth': 1,
                            "type": "column",
                            "fillAlphas": 0.7,
                            "valueField": "soldPriceDistribution",
                            "balloonText": current === 'en-US' ? "[[value]] units" :  "[[value]] unités",
                        }
                    ]

                    this.buildChart(mergedData, graphs, valueAxes)
                }
            }
        }
    }

    buildChart(dataProvider, graphs, valueAxes) {
        this.chart = this.chartService.makeChart(this.id, {
            "type": "serial",
            "theme": "none",
            "legend": {
                "enabled": false
            },
            "dataProvider": dataProvider,
            "valueAxes": valueAxes,
            "graphs": graphs,
            "chartCursor": {
                "fullWidth": true,
                "cursorAlpha": 0.05,
                "valueLineEnabled":true,
                "valueLineAlpha":0.5,
                "valueLineBalloonEnabled":true
            },
            "categoryField": "x",
            "chartScrollbar": {
                "autoGridCount": true,
                "graph": "fromGraph",
                "scrollbarHeight": 5,
                "backgroundAlpha": 0.1,
                "backgroundColor": "#868686",
                "selectedBackgroundColor": "#349E89",
                "selectedBackgroundAlpha": 1,
                'enabled': true
            },
            "categoryAxis": {
                "parseDates":false,
                'axisColor': '#5CB09F',
                "gridAlpha": 0.1,
                "gridColor": "#FFFFFF",
                "gridCount": 50,
                'axisThickness': 2,
                'gridThickness': 0,
                "minorGridEnabled": true
            }
        })
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}
