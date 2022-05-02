import { Component, OnInit } from '@angular/core'
import { Validators } from '@angular/forms'
import { NewTokenBody } from '@app/api_generated'
import { AppLanguage, AppLanguageCode } from '@app/core/models/language.enum'
import { SignUpError } from '@app/core/models/signup-err.interface'
import { RouterMap } from '@app/core/utils/router-map.util'
import { take } from 'rxjs/operators'
import { SignupComponent } from '../signup/signup.component'

@Component({
	selector: 'app-signup-oauth',
	templateUrl: './signup-oauth.component.html',
	styleUrls: ['./signup-oauth.component.scss']
})
export class SignupOauthComponent extends SignupComponent implements OnInit {

	totalSteps = 2
	queryParams: any = {}
	lastStep = 2
	user: any
	providerUserId: string
	provider: NewTokenBody.ProviderEnum
	providerToken: string
	isFrom: NewTokenBody.ProviderEnum

	error_messages: SignUpError = {
		age: [
			{ type: 'required', message: 'page.singup.err.age-require' }
		],

		phoneNumber: [
			{ type: 'required', message: 'page.signup.err.phone-require' },
			{ type: 'minlength', message: 'page.signup.err.phone-minlength' },
		]
	}

	ngOnInit() {
		try {
			const language = this.translateService.currentLang as AppLanguage === AppLanguage.French_CA ? AppLanguageCode.French_CA : AppLanguageCode.English

			this.form = this.formBuilder.group({
				firstname: ['', { validators: [Validators.required], updateOn: 'change' }],
				lastname: ['', { validators: [Validators.required], updateOn: 'change' }],
				email: ['', { validators: [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')], updateOn: 'change' }],
				phoneNumber: ['', { validators: [Validators.required, Validators.minLength(10)], updateOn: 'change' }],
				verifyCode: ['', []],
				countryCode: [1, { validators: [Validators.required, Validators.minLength(1)], updateOn: 'change' }],
				age: ['', { validators: [Validators.required] }],
				language: [language]
			})

			this.route.queryParams.pipe(take(1)).subscribe((res) => {
				const data = JSON.parse(res.data)
				if (res) {
					this.isFrom = data.isFrom || this.isFrom
					this.providerUserId = data.providerUserId
					this.providerToken = data.providerToken
					this.step = Number(res.step) || this.step
					this.user = data.user
					const { firstname, lastname, email } = this.user

					this.form.get('firstname').setValue(firstname)
					this.form.get('lastname').setValue(lastname)
					this.form.get('email').setValue(email)
				}

				this.route.queryParams.pipe(take(1)).subscribe((res) => {
					const data = JSON.parse(res.data)
					if (res) {
						this.isFrom = data.isFrom || this.isFrom
						this.providerUserId = data.providerUserId
						this.providerToken = data.providerToken
						this.step = Number(res.step) || this.step
						this.user = data.user
						const { firstname, lastname, email } = this.user

						this.form.get('firstname').setValue(firstname)
						this.form.get('lastname').setValue(lastname)
						this.form.get('email').setValue(email)
					}

					if (this.step !== null) {
						const queryParams: any = {}
						queryParams.step = this.step
						queryParams.isFrom = this.isFrom
						queryParams.user = this.user
						queryParams.providerId = this.providerUserId
						queryParams.providerToken = this.providerToken
						this.queryParams = queryParams
						this.router.navigate([RouterMap.OAuthSignup.path], { queryParams })
					}

				})

			})
			
		} catch (error) {
			console.error(error)
		}
		
	}

	next() {
		if (this.step === 1) {
			this.step++
			this.queryParams.step = this.step
			this.queryParams.isFrom = this.isFrom
			this.router.navigate([RouterMap.OAuthSignup.path], { queryParams: this.queryParams })
			this.getVerificationCode(false)
		}
	}

	async getVerificationCode(isResend: boolean) {
		try {
			this.isLoading = true
			const fullNumber = `${this.form.controls.countryCode.value}${this.form.controls.phoneNumber.value}`
			await this.apiAuthService.getVerificationCode(fullNumber, this.translateService.getBrowserLang()).toPromise()
			this.step = this.lastStep
			this.form.patchValue({
				verifyCode: ''
			})
			this.errMessage = ''
			this.isLoading = false
		}
		catch (err) {
			console.error(err)
			if (err.error.status >= 400) {
				this.errMessage = err.error.code ? this.translateService.instant(err.error.code) : err.error.message
			}
			this.isLoading = false
		}
	}

	isOauthSignupDisable() {
		if (this.isLoading) {
			return true
		}
		else {
			if (this.step === 1) {
				return !this.form.controls.phoneNumber.valid
			}
			else {
				return !this.form.valid
			}
		}
	}

	async create() {
		const obj: any = {
			...this.user
		}
		obj[this.isFrom] = {
			id: this.providerUserId,
			providerToken: this.providerToken
		}
		await super.create(obj)
	}

}
