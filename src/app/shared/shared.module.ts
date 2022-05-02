import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumericMaskCleanDirective } from './directives/numeric-mask-clean.directive';
import { NumberOnlyInputDirective } from './directives/number-only-input.directive';
import { ImgFallbackDirective } from './directives/image-fallback.directive';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { LoaderModule } from './components/loader/loader.module';
import { TranslateModule } from '@ngx-translate/core';
import { FinancingChartComponent } from './components/financing-chart/financing-chart.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BanksSelectorComponent } from './components/banks-selector/banks-selector.component';
import { MatProgressSpinnerModule, MatFormFieldModule, MatSlideToggleModule, MatIconModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';
import { ConfirmationModule } from './components/confirmation/confirmation.module';
import { NotificationComponent } from './components/notification/notification.component';
import { XyLineChartComponent } from './components/xy-line-chart/xy-line-chart.component';
import { LineAreaChartComponent } from './components/line-area-chart/line-area-chart.component';
import { StackChartComponent } from './components/stack-chart/stack-chart.component';
import { MeterModule } from './components/meter/meter.module';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { NoticeOfInterestButtonComponent } from './components/notice-of-interest-button/notice-of-interest-button.component';
import { FillBetweenLinesComponent } from './components/fill-between-lines/fill-between-lines.component';
import { PipesModule } from '@app-pipes/pipes.module';
import { SocialSharingDlgComponent } from './components/social-sharing-dlg/social-sharing-dlg.component';
import { AutofocusModule } from 'angular-autofocus-fix';
import { PropertyPendingCardComponent } from './components/property-pending-card/property-pending-card.component';
import { ItemModule } from './components/item/item.module';
import { LanguageChangeDlgComponent } from './components/language-change-dlg/language-change-dlg.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { InputNumber2Component } from './components/input-number2/input-number2.component';
import { GroupOptionsComponent } from './components/group-options/group-options.component';
import { DefaultImageComponent } from './components/default-image/default-image.component';
import { DefaultImageDirective } from './directives/default-image.directive';
import { ProgressBarChartComponent } from './components/progress-bar-chart/progress-bar-chart.component';
import { CountryFlagPickerComponent } from './components/country-flag-picker/country-flag-picker.component';

@NgModule({
	imports: [
		CommonModule,
		NgxSpinnerModule,
		LoaderModule,
		TranslateModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule,
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		FormsModule,
		ConfirmationModule,
		MeterModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSlideToggleModule,
		PipesModule,
		AutofocusModule,
		ItemModule,
	],
	declarations: [
		NumericMaskCleanDirective,
		NumberOnlyInputDirective,
		ImgFallbackDirective,
		SpinnerComponent,
		UploadImageComponent,
		UploadImageComponent,
		TooltipComponent,
		FinancingChartComponent,
		InputNumberComponent,
		BanksSelectorComponent,
		ProgressSpinnerComponent,
		PromptDialogComponent,
		ProgressSpinnerComponent,
		NotificationComponent,
		XyLineChartComponent,
		LineAreaChartComponent,
		StackChartComponent,
		PieChartComponent,
		AutocompleteComponent,
		NoticeOfInterestButtonComponent,
		FillBetweenLinesComponent,
		SocialSharingDlgComponent,
		PropertyPendingCardComponent,
		LanguageChangeDlgComponent,
		SkeletonComponent,
		InputNumber2Component,
		GroupOptionsComponent,
		DefaultImageComponent,
		DefaultImageDirective,
		ProgressBarChartComponent,
		CountryFlagPickerComponent,
	],
	exports: [
		NumericMaskCleanDirective,
		NumberOnlyInputDirective,
		ImgFallbackDirective,
		NgxSpinnerModule,
		MatProgressSpinnerModule,
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatDatepickerModule,
		MatNativeDateModule,
		SpinnerComponent,
		UploadImageComponent,
		TooltipComponent,
		LoaderModule,
		FinancingChartComponent,
		InputNumberComponent,
		BanksSelectorComponent,
		ProgressSpinnerComponent,
		PromptDialogComponent,
		FormsModule,
		NotificationComponent,
		XyLineChartComponent,
		LineAreaChartComponent,
		StackChartComponent,
		MeterModule,
		PieChartComponent,
		AutocompleteComponent,
		NoticeOfInterestButtonComponent,
		MatSlideToggleModule,
		FillBetweenLinesComponent,
		SocialSharingDlgComponent,
		PropertyPendingCardComponent,
		LanguageChangeDlgComponent,
		SkeletonComponent,
		InputNumber2Component,
		GroupOptionsComponent,
		DefaultImageComponent,
		DefaultImageDirective,
		ProgressBarChartComponent,
		CountryFlagPickerComponent
	],
	entryComponents: [
		PromptDialogComponent, 
		NotificationComponent, 
		SocialSharingDlgComponent,
		LanguageChangeDlgComponent,
		DefaultImageComponent
	]
})
export class SharedModule { }
