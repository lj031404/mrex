import { Component, OnInit } from '@angular/core';
import { XYLineChart } from '@app-models/chart.interface';
@Component({
  selector: 'app-xy-chart-mock',
  templateUrl: './xy-chart-mock.component.html',
  styleUrls: ['./xy-chart-mock.component.scss']
})
export class XyChartMockComponent implements OnInit {
  xyChartData: XYLineChart
  xyChartDataWithNoBeta: XYLineChart
  constructor() { }

  ngOnInit() {
    this.xyChartData = this.generateMockData()
    this.xyChartDataWithNoBeta = {
        ...this.generateMockData(),
        title: 'XY-Chart withOut BetaData',
        isShowBeta: false,
        id: 'xyChartV2'
    }
  }

  generateMockData(): XYLineChart {
	return {
      id: 'xyChartV1',
      title: 'XY-Chart with BetaData',
      isShowBeta: true,
      valueUnit: '$',
      graphData: [{
              year: '1985',
              value: 300000
          },
          {
              year: '1995',
              value: 250000
          },
          {
              year: '2005',
              value: 350000
          },
          {
              year: '2015',
              value: 400000
          },
          {
              year: '2020',
              value: 420000
      }]
    }
  }

}
