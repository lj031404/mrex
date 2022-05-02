import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockedRoutingModule } from './mocked-routing.module';

import { MeterTestComponent } from './meter-test/meter-test.component';
import { MeterModule } from '../components/meter/meter.module';
import { XyChartMockComponent } from './xy-chart-mock/xy-chart-mock.component';
import { LineChartMockComponent } from './line-chart-mock/line-chart-mock.component';
import { HistogramChartMockComponent } from './histogram-chart-mock/histogram-chart-mock.component';
import { SharedModule } from '../shared.module';
import { PieChartMockComponent } from './pie-chart-mock/pie-chart-mock.component';


@NgModule({
	declarations: [MeterTestComponent, XyChartMockComponent, LineChartMockComponent, HistogramChartMockComponent, PieChartMockComponent],
	imports: [
		CommonModule,
		MockedRoutingModule,
		MeterModule,
		SharedModule
	]
})
export class MockedModule { }
