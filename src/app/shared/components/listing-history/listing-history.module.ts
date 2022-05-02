import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingHistoryComponent } from './listing-history.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';

@NgModule({
	declarations: [ListingHistoryComponent],
	imports: [
		CommonModule,
		PipesModule
	],
	exports: [
		ListingHistoryComponent
	]
})
export class ListingHistoryModule { }
