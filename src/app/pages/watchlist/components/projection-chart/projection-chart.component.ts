import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { StackChart } from '@app-models/chart.interface';
import { PropertyLocalData, Property } from '@app/core/models/property.interface';
import * as _ from 'lodash';

@Component({
  selector: 'app-projection-chart',
  templateUrl: './projection-chart.component.html',
  styleUrls: ['./projection-chart.component.scss']
})
export class ProjectionChartComponent implements OnInit, OnChanges {
    @Input() propertyDoc: PropertyLocalData;
    stackChart: StackChart[] = []
    currentChartId = ''
    chartData

    currentYearIndex = 0
    constructor() { }

    ngOnInit() {       
    }

    ngOnChanges() {
        if(this.propertyDoc.hypothesisData && this.propertyDoc.hypothesisData.output.projectionsChart) {
            this.chartData = this.propertyDoc.hypothesisData.output.projectionsChart
            this.stackChart = this.buildChart()
            if (this.stackChart && this.stackChart.length) {
                this.currentChartId = this.stackChart[0].id
            }
        }
    }

    buildChart() {
       return this.chartData.map(chart => {
            return {
                id: `projection-${chart.title.toLocaleLowerCase().replace(' ', '_')}`,
                valueUnit: '$',
                categoryField: 'year',
                title: chart.title,
                legend: {
                    "enabled": false,
                    "useGraphSettings": true
                },
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
                graphData: this.getDataProvider(chart.timeSeries)
            }
        })


    }

    getDataProvider(timeSeries) {
        const chartData = timeSeries.map(time => {
            let series = {}
            series['year'] = time.label
            time.data.forEach(element => {
                series[element.label.toLocaleLowerCase().split(' ').join('_') ] = element.value
            });
            series['total'] = _.sumBy(time.data, 'value')
         
            return series
        })
        return chartData
    }

    switchChart(chart: StackChart) {
        this.currentChartId = chart.id
    }

    viewNextYear() {
        this.currentYearIndex ++
    }

    viewPrevYear() {
        --this.currentYearIndex
    }
}
