import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuButtonComponent } from './menu-button/menu-button.component';
import { ActionButtonComponent } from './action-button/action-button.component';
import { GoBackButtonComponent } from './go-back-button/go-back-button.component';

@NgModule({
	declarations: [MenuButtonComponent, ActionButtonComponent, GoBackButtonComponent],
	exports: [
		MenuButtonComponent,
		ActionButtonComponent,
		GoBackButtonComponent
	],
	imports: [
		CommonModule
	]
})
export class ButtonsModule { }
