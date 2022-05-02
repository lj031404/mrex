import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';

import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app-components/buttons/buttons.module';
import { ItemModule } from '@app-components/item/item.module';
import { FormFieldModule } from '@app-components/form-field/form-field.module';
import { ConfirmationModule } from '@app/shared/components/confirmation/confirmation.module';
import { PipesModule } from '@app-pipes/pipes.module';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './profile/profile.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PaymentComponent } from './payment/payment.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ReportComponent } from './report/report.component';
import { AboutComponent } from './about/about.component';
import { BuyCreditsComponent } from './buy-credits/buy-credits.component';
import { PaymentModalContentComponent } from './modals/payment-modal-content/payment-modal-content.component';
import { TermOfUseComponent } from './modals/term-of-use/term-of-use.component';
import { PrivacyPolicyComponent } from './modals/privacy-policy/privacy-policy.component';
import { SharedModule } from '@app/shared/shared.module';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
	declarations: [SettingsComponent, ProfileComponent, PreferencesComponent, PaymentComponent, SubscriptionComponent, ReportComponent, AboutComponent, PaymentModalContentComponent, BuyCreditsComponent, TermOfUseComponent, PrivacyPolicyComponent, ConfirmOrderComponent],
	imports: [
		CommonModule,
		SettingsRoutingModule,
		ReactiveFormsModule,
		TranslateModule,
		MatSlideToggleModule,
		NgxMaskModule,

		LayoutModule,
		ButtonsModule,
		ItemModule,
		FormFieldModule,
		ConfirmationModule,
		PipesModule,
		SharedModule,
		IonicModule
	],
	entryComponents: [PaymentModalContentComponent, TermOfUseComponent, PrivacyPolicyComponent]
})
export class SettingsModule {
}
