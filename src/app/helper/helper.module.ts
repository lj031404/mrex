import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { IonicModule } from '@ionic/angular';

import { LayoutModule } from '@app/layout/layout.module';
import { ItemModule } from '@app/shared/components/item/item.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { FormFieldModule } from '@app/shared/components/form-field/form-field.module';
import { SelectModule } from '@app/shared/components/select/select.module';
import { StepperModule } from '@app/shared/components/stepper/stepper.module';

import { PropertySearchDrawerComponent } from './property-search-drawer/property-search-drawer.component';

import { PropertyAddComponent } from './property-add/property-add.component';
import { PropertyInfoComponent } from './property-add/components/property-info/property-info.component';
import { PurchaseInfoComponent } from './property-add/components/purchase-info/purchase-info.component';
import { PropertyCashFlowComponent } from './property-add/components/property-cash-flow/property-cash-flow.component';

import { AddressControlComponent } from './address-control/address-control.component';
import { PropertyItemizeControlComponent } from './property-itemize-control/property-itemize-control.component';
import { SharedModule } from '@app/shared/shared.module';
import { RefinancingComponent } from './property-add/components/property-cash-flow/refinancing/refinancing.component';
import { FinancingComponent } from './property-add/components/financing/financing.component';
import { SecondFinancingComponent } from './property-add/components/purchase-info/second-financing/second-financing.component';
import { AddUnregisterPropertyDlgComponent } from './add-unregister-property-dlg/add-unregister-property-dlg.component';
import { ConfirmNewPropertyDlgComponent } from './add-unregister-property-dlg/confirm-new-property-dlg/confirm-new-property-dlg.component';
import {  RouterModule } from '@angular/router';
 export const options: Partial<IConfig> | (() => Partial<IConfig>) = {}

@NgModule({
	declarations: [PropertySearchDrawerComponent, PropertyAddComponent, PropertyInfoComponent, PurchaseInfoComponent, PropertyCashFlowComponent, AddressControlComponent, PropertyItemizeControlComponent, RefinancingComponent, FinancingComponent, SecondFinancingComponent, AddUnregisterPropertyDlgComponent, ConfirmNewPropertyDlgComponent],
	imports: [
		CommonModule,
		TranslateModule,
		ReactiveFormsModule,
		FormsModule,
		ScrollingModule,
		NgxMaskModule.forRoot(options),

		LayoutModule,
		ItemModule,
		PipesModule,
		ButtonsModule,
		StepperModule,
		FormFieldModule,
		SelectModule,
		SharedModule,
		RouterModule,
		IonicModule
	],
	exports: [
		PropertySearchDrawerComponent,
		PropertyAddComponent,
		PropertyItemizeControlComponent,
		AddressControlComponent,
		SecondFinancingComponent
	],
	entryComponents: [
		PropertyAddComponent,
		AddUnregisterPropertyDlgComponent,
		ConfirmNewPropertyDlgComponent
	],
	providers: [DecimalPipe]
})
export class HelperModule { }
