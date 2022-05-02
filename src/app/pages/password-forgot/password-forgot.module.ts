import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordForgotComponent } from './password-forgot.component';
import { ForgotStep1Component } from './forgot-step1/forgot-step1.component';
import { ForgotStep3Component } from './forgot-step3/forgot-step3.component';
import { SignupModule } from '../signup/signup.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordForgotRolutingModule } from './password-forgot-routing.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';

const NGX_MASK_OPTIONS: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [PasswordForgotComponent, ForgotStep1Component, ForgotStep3Component],
  imports: [
	CommonModule,
	PasswordForgotRolutingModule,
	SignupModule,
	TranslateModule,
	SharedModule,
	ReactiveFormsModule,
	NgxMaskModule.forRoot(NGX_MASK_OPTIONS)
  ]
})
export class PasswordForgotModule { }
