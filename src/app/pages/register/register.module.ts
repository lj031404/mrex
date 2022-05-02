import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';

@NgModule({
	declarations: [RegisterComponent],
	imports: [
		CommonModule,
		RegisterRoutingModule,
		ReactiveFormsModule,
		TranslateModule,

		SharedModule,
		LoaderModule
	]
})
export class RegisterModule { }
