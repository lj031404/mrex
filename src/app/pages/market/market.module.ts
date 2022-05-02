import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { Ng5SliderModule } from 'ng5-slider';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material';
import { TooltipModule } from 'ng2-tooltip-directive';

import { PipesModule } from '@app-pipes/pipes.module';
import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app-components/buttons/buttons.module';
import { TabModule } from '@app-components/tab/tab.module';
import { ItemModule } from '@app-components/item/item.module';
import { PictureSliderModule } from '@app-components/picture-slider/picture-slider.module';
import { ExpansionPanelModule } from '@app-components/expansion-panel/expansion-panel.module';
import { ConfirmationModule } from '@app/shared/components/confirmation/confirmation.module';
import { StreetViewModule } from '@app-components/street-view/street-view.module';
import { AgmMapModule } from '@app-components/agm-map/agm-map.module';

import { MarketRoutingModule } from './market-routing.module';
import { MarketOverviewComponent } from './market-overview/market-overview.component';
import { MarketListComponent } from './market-list/market-list.component';
import { FilterPadComponent } from './modals/filter-pad/filter-pad.component';
import { MakeOfferComponent } from './modals/make-offer/make-offer.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { MarketDataTableComponent } from './components/market-data-table/market-data-table.component';
import { PerformanceChartComponent } from './components/performance-chart/performance-chart.component';
import { SharedModule } from '@app/shared/shared.module';
import { MarketListingComponent } from './market-listing/market-listing.component';
import { SalesComparisonComponent } from './sales-comparison/sales-comparison.component';
import { SalesComparisonOverviewComponent } from './components/sales-comparison-overview/sales-comparison-overview.component';
import { SalesComparablesComponent } from './components/sales-comparables/sales-comparables.component';
import { HelperModule } from '@app/helper/helper.module';
import { NgxMaskModule } from 'ngx-mask';
import { NotesComponent } from './components/notes/notes.component';
import { MapPropertyCardComponent } from './components/map-property-card/map-property-card.component';

import { environment } from '../../../environments/environment';
import { MarketSavedComponent } from './market-saved/market-saved.component';
import { SavedSearchCardComponent } from './components/saved-search-card/saved-search-card.component';
import { AdvancedSalesComparisonComponent } from './advanced-sales-comparison/advanced-sales-comparison.component';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MarketMapComponent } from './market-map/market-map.component';


const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
	observer: true,
	direction: 'horizontal',
	threshold: 50,
	spaceBetween: 5,
	slidesPerView: 1,
	centeredSlides: true
  };
  
@NgModule({
	declarations: [
		MarketOverviewComponent,
		MarketListComponent,
		FilterPadComponent,
		PropertyCardComponent,
		MarketDataTableComponent,
		PerformanceChartComponent,
		MakeOfferComponent,
		MarketListingComponent,
		SalesComparisonComponent,
		SalesComparisonOverviewComponent,
		SalesComparablesComponent,
		NotesComponent,
		MapPropertyCardComponent,
		MarketSavedComponent,
		SavedSearchCardComponent,
		AdvancedSalesComparisonComponent,
		MarketMapComponent
	],
	imports: [
		CommonModule,
		MarketRoutingModule,
		ReactiveFormsModule,
		CdkTableModule,
		MatIconModule,
		Ng5SliderModule,
		ScrollingModule,
		TranslateModule,
		AgmMapModule,
		AgmJsMarkerClustererModule,

		LayoutModule,
		ButtonsModule,
		TabModule,
		AgmCoreModule,
		ItemModule,
		PictureSliderModule,
		ExpansionPanelModule,
		ConfirmationModule,
		PipesModule,
		StreetViewModule,
		SharedModule,
		MatSlideToggleModule,
		HelperModule,
		NgxMaskModule,
		TooltipModule,
		SwiperModule,
	],
	exports: [
		MarketListComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	entryComponents: [
		FilterPadComponent, 
		MakeOfferComponent, 
		NotesComponent,
		AdvancedSalesComparisonComponent,
		MarketSavedComponent,
		MarketListComponent,
		MarketMapComponent
	],
	providers: [
		{
		  provide: SWIPER_CONFIG,
		  useValue: DEFAULT_SWIPER_CONFIG
		}
	]
})
export class MarketModule { }

