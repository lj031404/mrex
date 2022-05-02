import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Market } from '@app/api_generated/model/market';
@Component({
  selector: 'app-all-property-types',
  templateUrl: './all-property-types.component.html',
  styleUrls: ['./all-property-types.component.scss']
})
export class AllPropertyTypesComponent implements OnInit, OnChanges {
  @Input() marketData: Market
  @Input() chartData: {
    averageDaysonMarketChart: Array<any>,
    soldActiveListings: Array<any>,
    soldPriceDistribution: Array<any>
  }
  @Output() getChartData: EventEmitter<number> = new EventEmitter()
  indicators
  currentChartYear = 5

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.indicators = this.marketData
  }

  switchChartYear(year) {
    this.currentChartYear = year
    this.getChartData.emit(year)
  }

}
