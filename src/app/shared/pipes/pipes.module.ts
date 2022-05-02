import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppNumberPipe } from './number.pipe';
import { IndicatorHtmlContentPipe } from './indicator-html-content.pipe';
import { PropertyAddressPipe } from './property-address.pipe';
import { PaymentCardNumberPipe } from './payment-card-number.pipe';
import { ShortNumberPipe } from './short-number.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { DateLangPipe } from './date-lang.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
	declarations: [IndicatorHtmlContentPipe, PropertyAddressPipe, AppNumberPipe, PaymentCardNumberPipe, ShortNumberPipe, TimeAgoPipe, DateFormatPipe, DateLangPipe, SafePipe],
	imports: [
		CommonModule
	],
	exports: [
		AppNumberPipe,
		IndicatorHtmlContentPipe,
		PropertyAddressPipe,
		PaymentCardNumberPipe,
		ShortNumberPipe,
		TimeAgoPipe,
		DateFormatPipe,
		DateLangPipe,
		SafePipe
	]
})
export class PipesModule { }
