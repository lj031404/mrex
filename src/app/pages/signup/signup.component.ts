import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { RouterMap } from '@app/core/utils/router-map.util'
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '@app/core/authentication/authentication.service'
import { AuthService as ApiAuthService } from '@app/api_generated/api/auth.service'
import { SignUpError } from '@app-core/models/signup-err.interface';
import { Subscription } from 'rxjs';
import { SyncService } from '@app/core/services/sync.service';
import { AppLanguage, AppLanguageCode } from '@app-models/language.enum';
import { UserService as UserDBService, UserService } from '@app/core/localDB/user.service';
import { LayoutService } from '@app/layout/service/layout.service';
import { User } from '@app/api_generated';
import * as Sentry from '@sentry/browser'

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

	form: FormGroup
	isLoading = false
	isFrom = ''
	step = 1
	totalSteps = 3
	errMessage = ''
	context: string
	lastStep = 3
	user: User = {}
	sub: Subscription = new Subscription()

	error_messages: SignUpError = {
		firstname: [
			{ type: 'required', message: 'page.signup.err.firstname-require' },
		],

		lastname: [
			{ type: 'required', message: 'page.signup.err.lastname-require' }
		],

		age: [
			{ type: 'required', message: 'page.singup.err.age-require' }
		],

		phoneNumber: [
			{ type: 'required', message: 'page.signup.err.phone-require' },
			{ type: 'minlength', message: 'page.signup.err.phone-minlength' },
		],

		email: [
			{ type: 'required', message: 'page.signup.err.email-require' },
			{ type: 'email', message: 'page.signup.err.email-email' }
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

	constructor(
		public formBuilder: FormBuilder,
		public route: ActivatedRoute,
		public router: Router,
		public translateService: TranslateService,
		public authenticationService: AuthenticationService,
		public apiAuthService: ApiAuthService,
		public syncService: SyncService,
		private userDBService: UserDBService,
		private userService: UserService,
		private layoutService: LayoutService
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
		const language = this.translateService.currentLang as AppLanguage === AppLanguage.French_CA ? AppLanguageCode.French_CA : AppLanguageCode.English

		this.form = this.formBuilder.group({
			firstname: ['', { validators: [Validators.required], updateOn: 'change' }],
			lastname: ['', { validators: [Validators.required], updateOn: 'change' }],
			age: ['', { validators: [Validators.required] }],
			email: ['', { validators: [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')], updateOn: 'change' }],
			phoneNumber: ['', { validators: [Validators.required, Validators.minLength(10)], updateOn: 'change' }],
			countryCode: [1, { validators: [Validators.required, Validators.minLength(1)], updateOn: 'change' }],
			password: ['', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'change' }],
			confirmPassword: ['', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'change' }],
			verifyCode: ['', []],
			language: [language]
		})

		this.translateService.use(this.translateService.currentLang)

		this.sub.add(this.route.queryParams.pipe(take(1)).subscribe((res) => {
			if (res) {
				this.step = Number(res.step) || this.step

				if (res.context === 'oauth') {
					this.context = res.context
					this.totalSteps = 2
					this.step = 1
					this.user = res.user
					this.form = this.formBuilder.group({
						firstname: [this.user.firstname, { validators: [Validators.required], updateOn: 'change' }],
						lastname: [this.user.lastname, { validators: [Validators.required], updateOn: 'change' }],
						email: [this.user.email, { validators: [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')], updateOn: 'change' }],
						phoneNumber: ['', { validators: [Validators.required, Validators.minLength(11)], updateOn: 'change' }],
						verifyCode: ['', []],
						language: [language]
					})
					this.translateService.use(language)
				}
			}

			if (this.step !== null) {
				const queryParams: any = {}
				queryParams.step = this.step
				queryParams.context = this.context
				queryParams.user = this.user
				this.router.navigate([RouterMap.Signup.path], { queryParams })
			}
		}))
	}

	next() {
		if (this.step === 1) {
			this.step++
			this.router.navigate([RouterMap.Signup.path], { queryParams: { step: this.step } })
		} else if (this.step === 2) {
			this.getVerificationCode(false)
		}
	}

	async create(extraParams: any = {}) {
		this.isLoading = true

		try {

			const phoneNumber = `${this.form.controls.countryCode.value}${this.form.controls.phoneNumber.value}`
			const param = {
				...this.form.value,
				...extraParams,
				phoneNumber,
				notificationsSubscribe: true
			}
			if (param.age) {
				param.age = parseInt(param.age, 10)
			}
			delete param.confirmPassword
			delete param.countryCode
			delete param.phone

			const { token } = await this.apiAuthService.userSignup(param).toPromise()
			await this.authenticationService.saveToken(token)

			this.user = await this.userService.pullUser()

			this.user.metadata = {
				skipDate: new Date().toString(),
			}

			this.userDBService.save(this.user)
			this.authenticationService.saveUser(this.user)

			// asynchronously update the user on API
			await this.userService.pushUser(this.user)

			this.router.navigate([this.route.snapshot.queryParams.redirect || RouterMap.Home.path], { replaceUrl: true })

		}
		catch (err) {
			console.error(err)
			Sentry.captureException(`[signup.component] Error: ${JSON.stringify(err)}`)
			if (err && err.error && err.error.status >= 400) {
				try {
					this.errMessage = this.translateService.instant(err.error.code)
				} catch (error) {
					this.errMessage = this.translateService.instant('error.genericMessage')
				}
			}
			else {
				this.errMessage = this.translateService.instant('error.genericMessage')
			}
		}

		this.isLoading = false
	}

	cancel() {
		this.router.navigate([RouterMap.Signin.path])
	}

	async getVerificationCode(isResend: boolean) {
		this.isLoading = true

		try {
			const fullNumber = `${this.form.controls.countryCode.value}${this.form.controls.phoneNumber.value}`
			const res = await this.apiAuthService.getVerificationCode(fullNumber, this.translateService.getBrowserLang()).toPromise()
			this.step = this.lastStep
			this.form.patchValue({
				verifyCode: ''
			})

			if (isResend) {
				this.layoutService.openSnackBar(this.translateService.instant('page.signup.resend_code_success'), null, 5000, 'info')
			}
			this.router.navigate([RouterMap.Signup.path], { queryParams: { step: this.step } })
			this.errMessage = ''
		}
		catch (err) {
			if (err.error.status >= 400) {
				this.errMessage = err.error.code ? this.translateService.instant(err.error.code) : err.error.message
			}
		}
		this.isLoading = false
	}

	isDisable() {
		if (this.isLoading) {
			return true
		}
		else {
			if (this.step < 2) {
				return this.form.controls.firstname.valid && this.form.controls.lastname.valid && this.form.controls.age.valid ? false : true
			}
			else {
				return !(this.form.valid && this.password(this.form))
			}
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
