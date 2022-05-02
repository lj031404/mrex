import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationComponent } from './confirmation.component';

@NgModule({
	declarations: [ConfirmationComponent],
	exports: [
		ConfirmationComponent
	],
	imports: [
		CommonModule,
		TranslateModule
	],
	entryComponents: [ConfirmationComponent]
})
export class ConfirmationModule { }
