import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { debounceTime, takeWhile } from 'rxjs/operators';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	profileFormGroup: FormGroup

	constructor(
		private fb: FormBuilder,
		private settingsMiddleware: UserSettingsMiddlewareService
	) { }

	ngOnInit() {
		this.initForm()
		this.loadSettings()
		this.setFormSubscription()
	}

	initForm() {
		this.profileFormGroup = this.fb.group({
			email: [this.settingsMiddleware.email, Validators.compose([Validators.required, Validators.email])],
			street: [this.settingsMiddleware.street, Validators.required],
			postalCode: [this.settingsMiddleware.postalCode]
		})
	}

	async loadSettings() {

	}

	setFormSubscription() {
		this.profileFormGroup.controls.email.valueChanges
			.pipe(
				takeWhile(() => Boolean(this.profileFormGroup)),
				debounceTime(300)
			)
			.subscribe(change => this.settingsMiddleware.email = change)
		this.profileFormGroup.controls.street.valueChanges
			.pipe(
				takeWhile(() => Boolean(this.profileFormGroup)),
				debounceTime(300)
			)
			.subscribe(change => this.settingsMiddleware.street = change)
		this.profileFormGroup.controls.postalCode.valueChanges
			.pipe(
				takeWhile(() => Boolean(this.profileFormGroup)),
				debounceTime(300)
			)
			.subscribe(change => this.settingsMiddleware.postalCode = change)
	}
}
