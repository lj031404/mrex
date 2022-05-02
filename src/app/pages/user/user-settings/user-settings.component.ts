import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { UserService } from '@app/core/localDB/user.service'
import { refreshMaterialLabels } from '@app/shared/utils'
import { NGXLogger } from 'ngx-logger'
import { GlobalService } from '@app/core/services/global.service'
import { Location } from '@angular/common'

@Component({
	selector: 'app-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

	settingsForm: FormGroup = null
	isLoading = false
	isPartialLoading = false

	formChangeSub: Subscription = null
	backToPageSub: any = null

	// Amount of time to wait before auto-saving, in ms
	saveThrottleTime = 500

	language: string
	destroy$ = new Subject<boolean>()

	constructor(
		private fb: FormBuilder,
		private localDBUser: UserService,
		private global: GlobalService,
		private location: Location,
		private logger: NGXLogger,
		private translateService: TranslateService,
	) {
		this.backToPageSub = this.global.handleBack.subscribe(() => {
			this.location.back()
		})

	}

	ngOnInit() {
		this.isLoading = true
		this.createForm()
		this.loadSettings()
		this.listenFormChanges.bind(this)
	}

	ngOnDestroy() {
		if (this.formChangeSub) {
			this.formChangeSub.unsubscribe()
		}

		if (this.backToPageSub) {
			this.backToPageSub.unsubscribe()
		}
	}

	createForm() {
		const addressForm = {
			district: [''],
			street: ['', Validators.required],
			city: [''],
			province: [''],
			postalCode: [''],
			country: [''],
			latitude: [''],
			longitude: [''],
		}

		this.settingsForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			address: this.fb.group(addressForm),
			newslettersSubscribe: [false],
			notificationsSubscribe: [false],

		})
	}

	setSettingsForm(data: any) {
		if (!this.settingsForm) {
			return false
		}

		this.settingsForm.setValue(data)
		refreshMaterialLabels()
	}

	listenFormChanges() {
		if (!this.settingsForm) {
			console.warn('No settings form when trying to listen for changes')
			return false
		}

		this.formChangeSub = this.settingsForm.valueChanges
			.pipe(debounceTime(this.saveThrottleTime))
			.subscribe((newVal: any) => {
				if (this.settingsForm.valid) {
					this.submitSettings()
				}
			})
	}

	loadSettings() {
		const settings = this.localDBUser.getUserSettings()
		this.setSettingsForm(settings.data)
		this.isLoading = false
	}

	submitSettings() {
		const data = this.settingsForm.value
		this.isPartialLoading = true
		this.localDBUser.updateUserSettings(data)
		this.isPartialLoading = false
	}

	onLanguageChange(event: Event) {
		if (event.type === 'change') {
			const lang = (event.target as HTMLSelectElement).value

			const res = this.localDBUser.updateUserSettings({
				language: [ lang ]
			})
			console.log('Update User Settings', res)
			this.translateService.use(lang)
		}
	}
}
