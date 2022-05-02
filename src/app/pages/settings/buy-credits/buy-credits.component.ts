import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LayoutService } from '@app/layout/service/layout.service';
import { ConfirmationComponent } from '@app/shared/components/confirmation/confirmation.component';
import { _translate } from '@app/core/utils/translate.util';

@Component({
	selector: 'app-buy-credits',
	templateUrl: './buy-credits.component.html',
	styleUrls: ['./buy-credits.component.scss']
})
export class BuyCreditsComponent implements OnInit {

	formGroup: FormGroup

	constructor(
		private fb: FormBuilder,
		private layoutService: LayoutService
	) { }

	ngOnInit() {
		this.initForm()
	}

	onFormGroupSubmit() {
		this.buyCredits(this.formGroup.controls.credits.value)
	}

	initForm() {
		this.formGroup = this.fb.group({
			credits: [null, Validators.required]
		})
	}

	buyCredits(credits: number) {
		const creditsStrings = [
			_translate('notification.purchase_credits.200'),
			_translate('notification.purchase_credits.50'),
			_translate('notification.purchase_credits.500'),
			_translate('notification.purchase_credits.1000'),
		]

		this.layoutService.openModal(ConfirmationComponent, {
			icon: '<i class="fa fa-check"></i>',
			title: 'notification.purchase_credits.' + credits,
			text: _translate('notification.purchase_credits.subtitle')
		})
	}
}
