import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TabGroupComponent } from './tab-group/tab-group.component';
import { TabComponent } from './tab/tab.component';
import { TabControllerComponent } from './tab-controller/tab-controller.component';
import { TabIndicatorComponent } from './tab-indicator/tab-indicator.component';
import { TabsLayoutOutletComponent } from '@app/shared/components/tab/tabs-layout-outlet/tabs-layout-outlet.component';


@NgModule({
	declarations: [TabGroupComponent, TabComponent, TabControllerComponent, TabIndicatorComponent, TabsLayoutOutletComponent],
	imports: [
		CommonModule,
		RouterModule
	],
	exports: [
		TabGroupComponent,
		TabComponent,
		TabControllerComponent,
		TabIndicatorComponent,
		TabsLayoutOutletComponent
	]
})
export class TabModule { }
