import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '@app/shared/shared.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SwitchApiDlgComponent } from './switch-api-dlg/switch-api-dlg.component';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TranslateModule,
		NgbModule,
		SharedModule,
		LoginRoutingModule,
		LoaderModule
	],
	declarations: [
		LoginComponent,
		SwitchApiDlgComponent
	],
	entryComponents: [
		SwitchApiDlgComponent
	]
})
export class LoginModule { }
