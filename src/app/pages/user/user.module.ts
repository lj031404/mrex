import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';

@NgModule({
	declarations: [ UserSettingsComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TextMaskModule,
		TranslateModule,

		SharedModule,
		LayoutModule,
		ButtonsModule,
		LoaderModule
	]
})
export class UserModule { }
