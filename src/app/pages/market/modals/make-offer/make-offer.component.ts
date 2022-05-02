import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { _translate } from '@app/core/utils/translate.util';

import { ModalRef } from '@app-models/modal-ref';
import { LayoutService } from '@app/layout/service/layout.service';
import { ConfirmationComponent } from '@app/shared/components/confirmation/confirmation.component';
import { UserNotice, NoticesService } from '@app/api_generated';
import { MarketMiddlewareService } from '@app-middleware/market-middleware.service';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { take } from 'rxjs/operators';

interface Check {
	text: string
	value: string
}

@Component({
	selector: 'app-make-offer',
	templateUrl: './make-offer.component.html',
	styleUrls: ['./make-offer.component.scss']
})
export class MakeOfferComponent implements OnInit {
	@Input() modalRef: ModalRef
	@Input() listingId: string
	@Input() propertyId: string

	form: FormGroup

	public choices: Check[] = [
		{
			text: 'page.market.make_an_offer.contactMeBy.email',
			value: 'email'
		},
		{
			text: 'page.market.make_an_offer.contactMeBy.phone',
			value: 'phone'
		}
	]

	constructor(
		private fb: FormBuilder,
		private layoutService: LayoutService,
		private noticeService: NoticesService,
		private userService: UserSettingsMiddlewareService,
		private translate: TranslateService
	) {
	}

	ngOnInit() {
		this.initForm()
	}

	initForm() {
		this.form = this.fb.group({
			from: [this.userService.name, Validators.required],
			email: [this.userService.email, Validators.required],
			phone: [this.userService.phoneNumber, Validators.required],
			message: [null, Validators.required],
			contactMeBy: new FormArray([new FormControl(false), new FormControl(false)]),
		})
		console.dir(this.form.getRawValue())
	}

	get checkboxes() {
		return this.form.get('contactMeBy') as FormArray
	}

	get disableButton() {
		return this.form.invalid
	}

	async sendNotice() {

		const selectedOrderIds = this.form.value.contactMeBy
			.map((checked, i) => checked ? this.choices[i].value : null)
			.filter(v => v !== null)

		const listingOffer: UserNotice = {
			name: this.form.value.from,
			email: this.form.value.email,
			phoneNumber: this.form.value.phone,
			message: this.form.value.message,
			listingId: this.listingId,
			propertyId: this.propertyId,
			contactPreference: selectedOrderIds
		}

		this.noticeService.sendNotice(listingOffer).pipe(take(1)).subscribe(
			res => {
				this.offerWasSent()
			}, err => {
				this.layoutService.openSnackBar(
					this.translate.instant('error.genericMessage'),
					null,
					3000,
					'error',
					false
				)
			}
		)

		const listings = [ ...this.userService.user.metadata.noticeListings || [], this.listingId ]

		const metadata = {
			...this.userService.user.metadata,
			noticeListings: listings
		}

		await this.userService.save({ metadata })

	}

	offerWasSent() {
		const notificationModalRef = this.layoutService.openModal(ConfirmationComponent, {
			icon: '<i class="fa fa-envelope"></i>',
			title: _translate('notification.offer_was_sent'),
			text: _translate('notification.offer_was_sent_desc'),
		})

		notificationModalRef.closed$.toPromise()
		this.modalRef.closeModal()
	}

	closeModal = () => {
		this.modalRef.closeModal()
	}
}
