import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatMenuModule } from '@angular/material';

import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { ItemModule } from '@app/shared/components/item/item.module';
import { TabModule } from '@app/shared/components/tab/tab.module';
import { AgmMapModule } from '@app/shared/components/agm-map/agm-map.module';
import { PictureSliderModule } from '@app/shared/components/picture-slider/picture-slider.module';
import { HelperModule } from '@app/helper/helper.module';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyOverviewComponent } from './property-overview/property-overview.component';
import { PropertyMapComponent } from './property-map/property-map.component';
import { PropertyModelsListComponent } from './property-models-list/property-models-list.component';
import { PropertyCompareComponent } from './property-compare/property-compare.component';
import { PropertyModelOverviewComponent } from './property-model-overview/property-model-overview.component';

import { PropertySummaryComponent } from './components/property-summary/property-summary.component';
import { PropertyFinancialInfoComponent } from './components/property-financial-info/property-financial-info.component';
import { PropertyExpensesComponent } from './components/property-expenses/property-expenses.component';
import { SharedModule } from '@app/shared/shared.module';
import { PropertyOverviewAccordionComponent } from './components/property-overview-accordion/property-overview-accordion.component';
import { PropertyMoneyChartComponent } from './components/property-money-chart/property-money-chart.component';
import { PropertyIrrHistogramComponent } from './components/property-irr-histogram/property-irr-histogram.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { IndicatorComponent } from './property-compare/compare-item/indicator/indicator.component';
import { PropertiesSelectComponent } from './components/properties-select/properties-select.component';
import { PropertyActivityComponent } from './property-activity/property-activity.component';
import { PropertyHeaderComponent } from './components/property-header/property-header.component';
import { ListingActivityFeedModule } from '@app/shared/components/listing-activity-feed/listing-activity-feed.module';
import { ModelCardComponent } from './components/model-card/model-card.component';
import { ProjectionChartComponent } from './components/projection-chart/projection-chart.component';


@NgModule({
	declarations: [
		PropertiesComponent,
		PropertyOverviewComponent,
		PropertyMapComponent,
		PropertyModelsListComponent,
		PropertySummaryComponent,
		PropertyFinancialInfoComponent,
		PropertyExpensesComponent,
		PropertyCompareComponent,
		PropertyModelOverviewComponent,
		PropertyOverviewAccordionComponent,
		PropertyMoneyChartComponent,
		PropertyIrrHistogramComponent,
		PropertyCardComponent,
		IndicatorComponent,
		PropertiesSelectComponent,
		PropertyActivityComponent,
		PropertyHeaderComponent,
		ModelCardComponent,
		ProjectionChartComponent
	],
	imports: [
		CommonModule,
		PropertyRoutingModule,
		TranslateModule,
		NgxChartsModule,
		MatMenuModule,

		LayoutModule,
		ButtonsModule,
		PipesModule,
		ItemModule,
		TabModule,
		AgmMapModule,
		PictureSliderModule,
		HelperModule,
		SharedModule,
		ListingActivityFeedModule
	],
	entryComponents: [PropertiesSelectComponent]
})
export class PropertyModule { }
