import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
import { TranslateService } from '@ngx-translate/core';
import { AuthService as ApiAuthService } from '@app/api_generated/api/auth.service'
import { SignUpError } from '@app-core/models/signup-err.interface';
import { AuthenticationService } from '@app/core/authentication/authentication.service'
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { LayoutService } from '@app/layout/service/layout.service';
import { UserService as UserDBService, UserService } from '@app/core/localDB/user.service';
import { GeolocationService } from '@app/shared/services/geolocation.service';

@Component({
	selector: 'app-password-forgot',
	templateUrl: './password-forgot.component.html',
	styleUrls: ['./password-forgot.component.scss', '../signup/signup.component.scss']
})
export class PasswordForgotComponent implements OnInit, OnDestroy {

	form: FormGroup
	isLoading = false
	step = 1
	error_messages: SignUpError = {
		phoneNumber: [
			{ type: 'required', message: 'page.signup.err.phone-require' },
			{ type: 'minlength', message: 'page.signup.err.phone-minlength' },
		],
		password: [
			{ type: 'required', message: 'page.signup.err.pwd-require' },
			{ type: 'minlength', message: 'page.signup.err.pwd-minlength' },
		],
		confirmPassword: [
			{ type: 'required', message: 'page.signup.err.pwd-require' },
			{ type: 'minlength', message: 'page.signup.err.pwd-minlength' },
		],
	}
	errVerificationCode: string
	errResetPassword: string
	sub: Subscription = new Subscription()

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private translateService: TranslateService,
		private apiAuthService: ApiAuthService,
		private authenticationService: AuthenticationService,
		private spinnerService: SpinnerService,
		private layoutService: LayoutService,
		private userService: UserService,
	) {
		this.sub.add(
			this.route.queryParams.subscribe(params => {
				if (params['step']) {
					this.step = +params['step']
				}
			})
		)
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			phoneNumber: ['', { validators: [Validators.required, Validators.minLength(10)], updateOn: 'change' }],
			password: ['', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'change' }],
			confirmPassword: ['', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'change' }],
			verifyCode: ['', [Validators.required, Validators.minLength(6)]],
			countryCode: [1, { validators: [Validators.required, Validators.minLength(1)], updateOn: 'change' }],
		})
	}

	next() {
		this.step++
	}

	cancel() {
		this.router.navigate([RouterMap.Signin.path])
	}

	async getVerificationCode(isResend: boolean) {
		try {
			this.errVerificationCode = ''
			this.isLoading = true
			const fullNumber = `${this.form.controls.countryCode.value}${this.form.controls.phoneNumber.value}`
			const res = await this.apiAuthService.getVerificationCode(fullNumber, this.translateService.getBrowserLang(), true).toPromise()
			this.errVerificationCode = ''
			this.isLoading = false
			if (isResend) {
				this.layoutService.openSnackBar(this.translateService.instant('page.forgot.resend_code_success'), null, 3000, 'info')
			} else {
				this.layoutService.openSnackBar(this.translateService.instant('page.forgot.send_code_success'), null, 3000, 'info')
			}

			if (!isResend) {
				this.step++
				this.router.navigate([RouterMap.PasswordForgot.path], { queryParams: { step: this.step } })
			}
		}
		catch (err) {
			if (err.error.status >= 400) {
				this.errVerificationCode = err.error.code ? this.translateService.instant(err.error.code) : err.error.message
			}
			this.isLoading = false
		}
	}

	resetPassword() {
		this.spinnerService.show()
		this.spinnerService.text = ''
		const phoneNumber = `${this.form.controls.countryCode.value}${this.form.controls.phoneNumber.value}`
		const param = {
			phoneNumber,
			code: this.form.get('verifyCode').value
		}
		this.apiAuthService.validateVerificationCode(param).subscribe(res => {
			this.spinnerService.hide();
			this.step++;
			this.router.navigate([RouterMap.PasswordForgot.path], { queryParams: { step: this.step } })
		}, (err: HttpErrorResponse) => {
			this.spinnerService.hide();

			if (err && err.error) {
				const message = this.translateService.instant(err.error.code ? err.error.code : 'auth.validation-code-invalid')
				this.layoutService.openSnackBar(message, null, 3000, 'error')
			}
		})
	}

	async signin() {
		try {
			this.isLoading = true
			const phoneNumber = `${this.form.controls.countryCode.value}${this.form.controls.phoneNumber.value}`
			const param = {
				...this.form.value,
				code: this.form.value.verifyCode,
				phoneNumber
			}
			delete param.confirmPassword
			delete param.verifyCode
			delete param.countryCode
			delete param.phone

			const { token } = await this.apiAuthService.resetPassword(param).toPromise()
			this.authenticationService.saveToken(token)

			const user = await this.userService.pullUser()

			// asynchronously update the user on API
			await this.userService.pushUser(user)

			this.authenticationService.saveUser(user)

			this.router.navigate([RouterMap.Home.path], { replaceUrl: true })

		} catch (err) {
			this.isLoading = false
			if (err && err.error && err.error.status >= 400) {
				this.errResetPassword = err.error.message
			}
		}
	}

	isDisableNexButton() {
		if (this.step === 1) {
			return this.form.controls.phoneNumber.valid
		}
	}

	password(formGroup: FormGroup) {
		const { value: password } = formGroup.get('password')
		const { value: confirmPassword } = formGroup.get('confirmPassword')
		return password === confirmPassword
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

}
