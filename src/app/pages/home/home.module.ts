import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { TranslateModule } from '@ngx-translate/core';

import { HomeComponent } from './home/home.component';
import { SharedModule } from '@app-shared/shared.module'
import { YourPortfolioComponent } from './your-portfolio/your-portfolio.component';
import { HomePropertiesComponent } from './home-properties/home-properties.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketModule } from '@app-pages/market/market.module';
import { PipesModule } from '@app-pipes/pipes.module';
import { HomeNewsComponent } from './home-news/home-news.component';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { HomeRoutingModule } from './home-routing.module';
import { ArticleModule } from '@app-pages/article/article.module';
import { HelperModule } from '@app/helper/helper.module';
import { MarketStatsModule } from './market-stats/market-stats.module';
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { ScrollingModule } from '@angular/cdk/scrolling';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
	observer: true,
	direction: 'horizontal',
	threshold: 50,
	spaceBetween: 5,
	slidesPerView: 1,
	centeredSlides: true
  };
@NgModule({
  declarations: [HomeComponent, YourPortfolioComponent, HomePropertiesComponent, HomeNewsComponent],
  imports: [
	CommonModule,
	HomeRoutingModule,
	LayoutModule,
	ButtonsModule,
	TranslateModule,
	SharedModule,
	MarketModule,
	FormsModule,
	PipesModule,
	SwiperModule,
	ArticleModule,
	HelperModule,
	ReactiveFormsModule,
	MarketStatsModule,
	ScrollingModule,
  ],
  exports: [
	  YourPortfolioComponent
  ],
  providers: [
	{
		provide: SWIPER_CONFIG,
		useValue: DEFAULT_SWIPER_CONFIG
	},
	TabsStatesService
  ]
})
export class HomeModule { }
