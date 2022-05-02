import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { ItemModule } from '@app/shared/components/item/item.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { HelperModule } from '@app/helper/helper.module';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioSummaryComponent } from './portfolio-summary/portfolio-summary.component';
import { PortfolioPropertiesComponent } from './portfolio-properties/portfolio-properties.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { PortfolioPropertyComponent } from './portfolio-property/portfolio-property.component';
import { PortfolioOutletComponent } from './portfolio-outlet/portfolio-outlet.component';
import { ListingActivityFeedModule } from '@app/shared/components/listing-activity-feed/listing-activity-feed.module';
import { HomeModule } from '../home/home.module';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { ChartCollapseComponent } from './components/chart-collapse/chart-collapse.component';
import { LeaseDateApplyDlgComponent } from './components/lease-date-apply-dlg/lease-date-apply-dlg.component';
import { FormFieldModule } from '@app/shared/components/form-field/form-field.module';

@NgModule({
	declarations: [
		PortfolioSummaryComponent, 
		SummaryCardComponent, 
		PortfolioPropertiesComponent, 
		PortfolioPropertyComponent, 
		PortfolioOutletComponent, 
		PropertyCardComponent, 
		ChartCollapseComponent, 
		LeaseDateApplyDlgComponent
	],
	imports: [
		CommonModule,
		PortfolioRoutingModule,
		TranslateModule,
		FormsModule,

		LayoutModule,
		ButtonsModule,
		ItemModule,
		CardModule,
		PipesModule,
		HelperModule,
		ListingActivityFeedModule,
		HomeModule,
		MatSelectModule,
		SharedModule,
		FormFieldModule
	],
	entryComponents: [
		LeaseDateApplyDlgComponent
	]
})
export class PortfolioModule {
}
