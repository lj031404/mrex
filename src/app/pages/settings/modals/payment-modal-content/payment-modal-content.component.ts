import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { BillingService as ApiBillingService } from '@app/api_generated/api/billing.service'
import { ModalRef } from '@app/core/models/modal-ref';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { _translate } from '@app/core/utils/translate.util';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { AppLanguage } from '@app/core/models/language.enum';

// Stripe variables
declare var Stripe: any;
declare var stripe: any;
declare var elements: any;

@Component({
	selector: 'app-payment-modal-content',
	templateUrl: './payment-modal-content.component.html',
	styleUrls: ['./payment-modal-content.component.scss']
})
export class PaymentModalContentComponent implements OnInit {
	@Input() modalRef: ModalRef

	stripe
	card
	clientSecret

	formGroup: FormGroup
	isLoading = false
	err: { status: number, message: string } | null;
	cardType: string;
	isValid = false
	showSpinner = true
	billingDetails

	constructor(
		private http: HttpClient,
		private spinnerService: SpinnerService,
		private translate: TranslateService,
		private settingsMiddleware: UserSettingsMiddlewareService,
		private userSettingsMiddlewareService: UserSettingsMiddlewareService,
		private apiBillingService: ApiBillingService) {
	}

	async ngOnInit() {
		const _this = this

		this.showSpinner = true

		const orderData = {}

		this.billingDetails = {
			name: this.userSettingsMiddlewareService.name,
			phone: this.userSettingsMiddlewareService.phoneNumber,
			email: this.userSettingsMiddlewareService.email,
		}

		const data = await this.http.get(`${environment.serverUrl}/billing/stripe-details`, orderData).toPromise()
		const { stripe, card } = _this.setupElements(data)
		_this.stripe = stripe
		_this.card = card
		this.showSpinner = false
	}

	// Set up Stripe.js and Elements to use in checkout form
	setupElements = (data) => {
		this.stripe = Stripe(data.publishableKey, {
			locale: this.settingsMiddleware.language as AppLanguage === AppLanguage.English ? 'en' : 'fr'
		})
		const elements = this.stripe.elements()
		const style = {
			base: {
				color: '#32325d',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4'
				}
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a'
			}
		}

		const card = elements.create('card', {
			style
		})
		card.mount('#card-element')

		// Listen for events on card change
		card.on('change', (event) => {

			if (event.error && event.error.code) {
				this.err = { status: null, message: this.translate.instant(`stripe.error.${event.error.code}`) }
			} else {
				this.err = null
			}

			this.isValid = event.complete === true && !event.error
		})

		return {
			stripe: this.stripe,
			card: card
		}
	}

	async onFormSubmit() {

		try {
			this.err = null
			this.isLoading = true

			this.spinnerService.text = _translate('spinner.verifyCard')
			this.spinnerService.show()

			const res = await this.stripe.createPaymentMethod({
				type: 'card',
				card: this.card,
				billing_details: this.billingDetails,
			})

			if (res.error) {
				throw { error: res.error }
			}
			console.log(res)

			await this.apiBillingService.createPaymentMethod({ paymentMethodId: res.paymentMethod.id }).toPromise()

			this.isLoading = false
			this.spinnerService.hide()
			this.modalRef.closeModal(true)

		}
		catch (err) {
			console.error(err)
			this.err = err.error
			this.isLoading = false
			this.spinnerService.hide()
		}

	}
}
