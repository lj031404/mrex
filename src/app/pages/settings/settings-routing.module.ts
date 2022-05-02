import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { RouterMap } from '@app/core/utils/router-map.util'
import { SettingsComponent } from '@app/pages/settings/settings.component'
import { ProfileComponent } from '@app/pages/settings/profile/profile.component'
import { PreferencesComponent } from '@app/pages/settings/preferences/preferences.component'
import { PaymentComponent } from '@app/pages/settings/payment/payment.component'
import { ReportComponent } from '@app/pages/settings/report/report.component'
import { AboutComponent } from '@app/pages/settings/about/about.component'
import { BuyCreditsComponent } from '@app/pages/settings/buy-credits/buy-credits.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component'
import { PrivacyPolicyComponent } from './modals/privacy-policy/privacy-policy.component'
import { TermOfUseComponent } from './modals/term-of-use/term-of-use.component'

const routes: Routes = [
	{ path: '', component: SettingsComponent },
	{ path: RouterMap.Settings.PROFILE, component: ProfileComponent, data: { key: RouterMap.Settings.PROFILE } },
	{ path: RouterMap.Settings.PREFERENCES, component: PreferencesComponent, data: { key: RouterMap.Settings.PREFERENCES } },
	{ path: RouterMap.Settings.PAYMENT, component: PaymentComponent, data: { key: RouterMap.Settings.PAYMENT } },
	{ path: RouterMap.Settings.BUY_CREDITS, component: BuyCreditsComponent, data: { key: RouterMap.Settings.BUY_CREDITS } },
	{ path: RouterMap.Settings.REPORT, component: ReportComponent, data: { key: RouterMap.Settings.REPORT } },
	{ path: RouterMap.Settings.ABOUT, component: AboutComponent, data: { key: RouterMap.Settings.ABOUT } },	
	{ path: RouterMap.Settings.ORDER_CONFIRM, component: ConfirmOrderComponent, data: { key: RouterMap.Settings.ORDER_CONFIRM } },
]

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [RouterModule]
})
export class SettingsRoutingModule { }
