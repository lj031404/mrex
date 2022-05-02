import { Component, OnInit } from '@angular/core';
import { MarketsService } from '@app/api_generated';
import { LayoutService } from '@app/layout/service/layout.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { Market } from '@app/api_generated/model/market';
import { ChartIdentifiers } from '@app/api_generated/model/chartIdentifiers';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { PropertyType } from '@app/api_generated/model/propertyType'
import { HomeService } from '@app/core/services/home.service';
@Component({
  selector: 'app-market-stats',
  templateUrl: './market-stats.component.html',
  styleUrls: ['./market-stats.component.scss']
})
export class MarketStatsComponent implements OnInit {
  cities: Array< {
    id?: string;
    name?: string;
  }> = []
  districts = []

  selectedDistrictId = ''
  selectedCityId = ''
  
  cityName
  districtName
  marketData: Market
  isShowSearchForm: boolean
  chartIds = [
    ChartIdentifiers.MedianPrice,
    ChartIdentifiers.DaysOnMarket,
    ChartIdentifiers.TotalSold,
    ChartIdentifiers.NewListings,
    ChartIdentifiers.ActiveListings,
    ChartIdentifiers.SoldPriceDistribution
  ]
  chartData
  currentYear = 2
  isSubmitted
  PropertyType = PropertyType
  currentMarketStatsTab = ''

  constructor(
    private marketService: MarketsService,
    private spinnerService: SpinnerService,
    private layoutService: LayoutService,
    private translate: TranslateService,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.getCities()
  }

  async getCities() {
    this.spinnerService.show()
    this.spinnerService.text = ''
    try {
      this.cities = await this.homeService.getCities().toPromise()
      this.spinnerService.hide()
      this.spinnerService.text = ''
    } catch (error) {
      this.spinnerService.hide()
      this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
    }
  }

  async changeCity() {
    if (this.selectedCityId) {
      this.spinnerService.show()
      this.spinnerService.text = ''
      try {
        this.districts = await this.homeService.getDistricts(this.selectedCityId).toPromise()
        
        this.spinnerService.hide()
      } catch (error) {
        this.spinnerService.hide()
        this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
      }
    } else {
      this.selectedDistrictId = ''
      this.districts = []
    }
  }

  async getMarketsData() {
    this.marketData = null
    this.cityName = this.cities.find(city => city.id === this.selectedCityId).name
    this.districtName = this.districts.find(dist => dist.id === this.selectedDistrictId).name
    try {
      const marketData = await this.homeService.getMarketId(this.selectedCityId, this.selectedDistrictId, this.currentMarketStatsTab).toPromise()
      setTimeout(() => {
        this.isSubmitted = true
        this.marketData = marketData
      }, 500)
      
      this.getChartData(this.currentYear)
    } catch (error) {
      this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
    }
  }

  getChartArray(data) {
    const xAxis = data.data[0]
    const yAxis = data.data[1]
    const units = data.units
    return xAxis.map((x, index) => ({
      x: x,
      y: yAxis[index],
      units
    }))
  }

  getChartData(year = 2) {
    this.currentYear = year
    this.chartData = null
    const fromDate = moment().subtract(this.currentYear, 'years').toString()

    const calls = this.chartIds.map(id => 
      this.homeService.getChartId(this.selectedCityId, id, fromDate, this.selectedDistrictId, this.currentMarketStatsTab)
    )
    forkJoin(calls).pipe(take(1)).subscribe(
      res => {
        const averageDaysonMarketChart = {
          medianPrice:this.getChartArray(res[0]),
          daysOnMarket:this.getChartArray(res[1])
        }
        const soldActiveListings = {
          totalSold: this.getChartArray(res[2]),
          newListings: this.getChartArray(res[3]),
          activeListings:this.getChartArray(res[4]),
        }

        const soldPriceDistribution = {
          soldPriceDistribution:  this.getChartArray(res[5])
        }

        setTimeout(() => {
          this.chartData = {
            averageDaysonMarketChart,
            soldActiveListings,
            soldPriceDistribution
          }
        }, 500)
       
      }
    )
  }

  switchTab(tab = '') {
    this.currentMarketStatsTab = tab
    this.getMarketsData()
  }

}
