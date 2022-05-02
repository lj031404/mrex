import {
	Component,
	ContentChild,
	HostBinding,
	Input,
	OnInit,
	ContentChildren,
	QueryList
} from '@angular/core'
import { NgControl } from '@angular/forms'
import { FormFieldLabelDirective } from '@app/shared/components/form-field/directives/form-field-label.directive'
import { FormFieldPrefixDirective } from '@app/shared/components/form-field/directives/form-field-prefix.directive'
import { FormFieldSuffixDirective } from '@app/shared/components/form-field/directives/form-field-suffix.directive'
import { FormFieldErrorDirective } from '@app/shared/components/form-field/directives/form-field-error.directive'
import { InputNumberComponent } from '../input-number/input-number.component'

@Component({
	selector: 'app-form-field',
	templateUrl: './form-field.component.html',
	styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent implements OnInit {

	@Input() rtl = false
	@Input() span = 12
	@Input() hidden = false
	@Input() leftMargin = false
	@Input() disabled = false
	@Input() field?: string

	@ContentChild(FormFieldLabelDirective, {static: false}) labelDirective: FormFieldLabelDirective
	@ContentChild(FormFieldPrefixDirective, {static: false}) prefixDirective: FormFieldPrefixDirective
	@ContentChild(FormFieldSuffixDirective, {static: false}) suffixDirective: FormFieldSuffixDirective
	@ContentChild(FormFieldErrorDirective, {static: false}) errorDirective: FormFieldErrorDirective

	@ContentChild(NgControl, {static: false}) control: NgControl
	@ContentChildren(InputNumberComponent, {descendants: true}) control2: QueryList<InputNumberComponent>

	@HostBinding('class.disabled') classHostDisabled = true

	@HostBinding('class.form-field') classHostName = true
	@HostBinding('class.d-none')
	get displayNone() {
		return this.hidden
	}
	@HostBinding('class.ng-blank')
	get blank() {
		return this.control && !this.control.value
			|| this.control2.toArray().length && this.control2.toArray()[0].form.value
	}
	@HostBinding('class.ng-touched')
	get ngTouched() {
		return this.control && this.control.touched
			|| this.control2.toArray().length && this.control2.toArray()[0].form.touched
	}

	@HostBinding('class.ng-untouched')
	get ngUntouched() {
		return this.control && this.control.untouched
			|| this.control2.toArray().length && this.control2.toArray()[0].form.untouched
	}

	@HostBinding('class.ng-pristine')
	get ngPristine() {
		return this.control && this.control.pristine
			|| this.control2.toArray().length && this.control2.toArray()[0].form.pristine
	}

	@HostBinding('class.ng-dirty')
	get ngDirty() {
		return this.control && this.control.dirty
			|| this.control2.toArray().length && this.control2.toArray()[0].form.dirty
	}

	@HostBinding('class.ng-valid')
	get ngValid() {
		return this.control && this.control.valid
			|| this.control2.toArray().length && this.control2.toArray()[0].form.valid
	}

	@HostBinding('class.ng-invalid')
	get ngInvalid() {
		return this.control && this.control.invalid 
			|| this.control2.toArray().length && this.control2.toArray()[0].form.invalid
	}

	@HostBinding('class.ng-pending')
	get ngPending() {
		return this.control && this.control.pending
			|| this.control2.toArray().length && this.control2.toArray()[0].form.pending
	}

	@HostBinding('attr.cols')
	get cols() {
		return (this.span > 0 && this.span < 12) ? this.span.toString() : undefined
	}

	constructor() { }

	ngOnInit() {
	}

}
