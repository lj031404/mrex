import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreetViewComponent } from './street-view.component';


@NgModule({
	declarations: [StreetViewComponent],
	imports: [
		CommonModule
	],
	exports: [
		StreetViewComponent
	]
})
export class StreetViewModule {
}
