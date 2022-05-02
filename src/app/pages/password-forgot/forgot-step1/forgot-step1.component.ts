import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SignUpError } from '@app-core/models/signup-err.interface';
import { Subscription } from 'rxjs';
import {phone} from 'phone';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-step1',
  templateUrl: './forgot-step1.component.html',
  styleUrls: ['./forgot-step1.component.scss']
})
export class ForgotStep1Component implements OnChanges, OnDestroy {
	@Input() form: FormGroup
	@Input() step: number
	@Input() error_messages: SignUpError
	@Input() errVerificationCode: string
	selectedCountryCode = 'ca'
	countryCodes = ['us', 'ca']
	customLabels = {
		us: 'United State  +1',
		ca: 'Canada  +1'
	}
	
	private subscription = new Subscription()

	constructor() { }

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

	ngOnDestroy() {
		this.subscription.unsubscribe()
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
