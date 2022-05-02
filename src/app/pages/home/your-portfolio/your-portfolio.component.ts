import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Portfolio } from '@app-models/home.interface';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { RouterMap } from '@app/core/utils/router-map.util';
import * as _ from 'lodash'
@Component({
  selector: 'app-your-portfolio',
  templateUrl: './your-portfolio.component.html',
  styleUrls: ['./your-portfolio.component.scss']
})
export class YourPortfolioComponent implements OnInit, OnChanges {
  @Input() portfolio: Portfolio[] = []
  @Output() openPropSearchDrawer: EventEmitter<any> = new EventEmitter();
  totalSum = 0
  isDev
  
  constructor(
    private router: Router,
    private settingsMiddleware: UserSettingsMiddlewareService,
  ) { }

  async ngOnInit() {
    this.isDev = await this.settingsMiddleware.isDev()
  }

  ngOnChanges() {
    this.totalSum = _.sumBy(this.portfolio, 'value')
  }

  openPortfolioAddForm() {
    this.openPropSearchDrawer.emit('open');
  }

  gotoPortfolioSummary() {
    this.router.navigate([RouterMap.Portfolio.path, RouterMap.Portfolio.SUMMARY])
  }

}
