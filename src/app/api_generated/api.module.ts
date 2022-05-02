import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AlertsService } from './api/alerts.service';
import { AssistanceService } from './api/assistance.service';
import { AuthService } from './api/auth.service';
import { BillingService } from './api/billing.service';
import { BlogService } from './api/blog.service';
import { CommentsService } from './api/comments.service';
import { FinancialsService } from './api/financials.service';
import { HealthService } from './api/health.service';
import { HomeService } from './api/home.service';
import { HypothesisService } from './api/hypothesis.service';
import { InternalService } from './api/internal.service';
import { MarketService } from './api/market.service';
import { MarketsService } from './api/markets.service';
import { NoticesService } from './api/notices.service';
import { PortfolioService } from './api/portfolio.service';
import { PropertiesService } from './api/properties.service';
import { SearchService } from './api/search.service';
import { SystemService } from './api/system.service';
import { UploadService } from './api/upload.service';
import { UsersService } from './api/users.service';
import { VideosService } from './api/videos.service';
import { WatchlistService } from './api/watchlist.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AlertsService,
    AssistanceService,
    AuthService,
    BillingService,
    BlogService,
    CommentsService,
    FinancialsService,
    HealthService,
    HomeService,
    HypothesisService,
    InternalService,
    MarketService,
    MarketsService,
    NoticesService,
    PortfolioService,
    PropertiesService,
    SearchService,
    SystemService,
    UploadService,
    UsersService,
    VideosService,
    WatchlistService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
