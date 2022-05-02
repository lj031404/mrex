import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListingActivityFeedComponent } from './listing-activity-feed.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [ListingActivityFeedComponent],
	imports: [
		CommonModule,
		RouterModule,
		PipesModule,
		TranslateModule
	],
	exports: [
		ListingActivityFeedComponent
	]
})
export class ListingActivityFeedModule { }
