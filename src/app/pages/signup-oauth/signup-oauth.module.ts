import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Step1Component } from './step1/step1.component'
import { Step2Component } from './step2/step2.component'
import { SignupOauthRoutingModule } from './signup-oauth-routing.module'
import { HeaderStepsComponent } from './header-steps/header-steps.component'
import { SignupOauthComponent } from './signup-oauth.component'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '@app/shared/shared.module'
import { ReactiveFormsModule } from '@angular/forms'
import { IConfig, NgxMaskModule } from 'ngx-mask'

const NGX_MASK_OPTIONS: Partial<IConfig> | (() => Partial<IConfig>) = {}

@NgModule({
  declarations: [Step1Component, Step2Component, HeaderStepsComponent, SignupOauthComponent],
  imports: [
	CommonModule,
	SignupOauthRoutingModule,
	TranslateModule,
	SharedModule,
	ReactiveFormsModule,
	NgxMaskModule.forRoot(NGX_MASK_OPTIONS)
  ],
  exports: [
	Step1Component, Step2Component, HeaderStepsComponent
  ]
})
export class SignupOauthModule { }
