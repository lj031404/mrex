import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SignUpError } from '@app/core/models/signup-err.interface';
import { AppLanguage, AppLanguageCode } from '@app-models/language.enum';
import { TranslateService } from '@ngx-translate/core';
import { NewTokenBody } from '@app/api_generated';
import { Subscription } from 'rxjs';
import { phone } from 'phone';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-step1',
	templateUrl: './step1.component.html',
	styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit, OnChanges, OnDestroy {

	selectedCountryCode = 'ca'
	countryCodes = ['us', 'ca']
	customLabels = {
		us: 'United State  +1',
		ca: 'Canada  +1',
	}

	@Input() form: FormGroup
	@Input() step: number
	@Input() errMessage: string
	@Input() error_messages: SignUpError
	@Input() isFrom: string

	itiPhonePicker
	AppLanguageCode = AppLanguageCode
	selectValues = [...Array(100).keys()].filter(x => x >= 16)

	private subscription = new Subscription()

	constructor(private translateService: TranslateService) { }

	ngOnInit() {
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

	onLanguageChange(event: Event) {
		if (event.type === 'change') {
			const language = (event.target as HTMLSelectElement).value as AppLanguageCode
			const lng = language === AppLanguageCode.English ? AppLanguage.English : AppLanguage.French_CA
			this.translateService.use(lng)
		}
	}

	get isSocialLogin() {
		return [
			NewTokenBody.ProviderEnum.Facebook,
			NewTokenBody.ProviderEnum.Google,
			NewTokenBody.ProviderEnum.Apple
		].includes(this.isFrom as NewTokenBody.ProviderEnum)
	}

	ngOnDestroy(): void {
		this.subscription.add()
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
