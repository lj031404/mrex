import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterComponent } from './meter.component';
import { GaugeModule } from 'angular-gauge';
import { PipesModule } from '@app-pipes/pipes.module';


@NgModule({
	declarations: [MeterComponent],
	imports: [
		CommonModule,
		GaugeModule,
		PipesModule
	],
	exports: [
		MeterComponent
	]
})
export class MeterModule { }
