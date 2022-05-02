import { Component, Input, OnDestroy, OnChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { SignUpError } from '@app-core/models/signup-err.interface';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {phone} from 'phone';

@Component({
	selector: 'app-step2',
	templateUrl: './step2.component.html',
	styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnDestroy, OnChanges {
	@Input() form: FormGroup
	@Input() step: number
	@Input() errMessage: string
	@Input() error_messages: SignUpError

	emailMoved: Boolean = false
	passMoved: Boolean = false
	confirmPassMoved: Boolean = false
	itiPhonePicker
	confirmPasswordEmpty:Boolean = false
	selectedCountryCode = 'ca'
	countryCodes = ['us', 'ca']
	customLabels = {
		us: 'United State  +1',
		ca: 'Canada  +1'
	}
	passwordType: string = 'password'
	conformPasswordType: string = 'password'

	private subscription = new Subscription()

	constructor() {
	}

	ngOnChanges() {
		if (this.form) {
			this.subscription.add(
				this.form.get('phoneNumber').valueChanges.pipe(filter(res => res && res.length > 9)).subscribe(res => {
					const val = phone(`+${this.form.get('countryCode').value}${res}`);
					if (val && val.countryIso2) {
						this.selectedCountryCode = val.countryIso2.toLowerCase()
					}
				})
			)
		}
	}

	password(formGroup: FormGroup) {
		const { value: password } = formGroup.get('password')
		const { value: confirmPassword } = formGroup.get('confirmPassword')
		if(confirmPassword === ""){
			this.confirmPasswordEmpty=true
		}else{
			this.confirmPasswordEmpty=false
		}
		if(confirmPassword === ""){
			return false
		}else{
			return password  === confirmPassword
		}
	}

	emailInputMoved(status: boolean) {
		this.emailMoved = status
	}

	passwordMoved(status: boolean) {
		this.passMoved = status
	}

	confirmMoved(status: boolean) {
		this.confirmPassMoved = status
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}

	passwordShow(type: string) {
		this.passwordType = type
	}
  
 	 conformPasswordShow(type: string) {
		this.conformPasswordType = type
	}

	changedCountryCode(evt: {
		code: string,
		dialCode: string
	}) {
		this.form.get('countryCode').setValue(evt.dialCode)
	}

	get prefix() {
		return '+' + this.form.get('countryCode').value
	}
}
