import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';

import { MeterTestComponent } from './meter-test/meter-test.component';
import { XyChartMockComponent } from './xy-chart-mock/xy-chart-mock.component';
import { HistogramChartMockComponent } from './histogram-chart-mock/histogram-chart-mock.component';
import { LineChartMockComponent } from './line-chart-mock/line-chart-mock.component';
import { PieChartMockComponent } from './pie-chart-mock/pie-chart-mock.component';

const routes: Routes = [
	{ path: 'meter', component: MeterTestComponent },
	{ path: 'xy-chart', component: XyChartMockComponent },
	{ path: 'histogram-chart', component: HistogramChartMockComponent },
	{ path: 'line-chart', component: LineChartMockComponent	},
	{ path: 'pie-chart', component: PieChartMockComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MockedRoutingModule { }
