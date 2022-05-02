import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PipesModule } from '@app-pipes/pipes.module';
import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app-shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MarketStatsComponent } from './market-stats.component';
import { AllPropertyTypesComponent } from './components/all-property-types/all-property-types.component';
import { MarketStatsChartComponent } from './components/market-stats-chart/market-stats-chart.component';


@NgModule({
  declarations: [
    MarketStatsComponent, 
    AllPropertyTypesComponent, 
    MarketStatsChartComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ButtonsModule,
    PipesModule,
    TranslateModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MarketStatsComponent
  ]
})
export class MarketStatsModule { }
