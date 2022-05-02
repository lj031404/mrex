import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldComponent } from './form-field.component';
import { FormFieldSuffixDirective } from './directives/form-field-suffix.directive';
import { FormFieldPrefixDirective } from './directives/form-field-prefix.directive';
import { FormFieldErrorDirective } from './directives/form-field-error.directive';
import { FormSectionNameDirective } from './directives/form-section-name.directive';
import { FormFieldLabelDirective } from './directives/form-field-label.directive';
import { FormField2Component } from './form-field2/form-field2.component';

@NgModule({
	declarations: [FormFieldComponent, FormFieldSuffixDirective, FormFieldPrefixDirective, FormFieldErrorDirective, FormSectionNameDirective, FormFieldLabelDirective, FormField2Component],
	imports: [
		CommonModule
	],
	exports: [
		FormFieldComponent,
		FormFieldPrefixDirective,
		FormSectionNameDirective,
		FormFieldLabelDirective,
		FormFieldSuffixDirective,
		FormField2Component
	]
})
export class FormFieldModule { }
