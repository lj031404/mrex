import { Component, OnInit } from '@angular/core'

import { LayoutService } from '@app/layout/service/layout.service'
import { PaymentModalContentComponent } from '../modals/payment-modal-content/payment-modal-content.component';
import { BillingService as ApiBillingService } from '@app/api_generated/api/billing.service'
import { Error } from '@app-models/err.interface';
import { Payment } from '@app-models/billing.interface';
import { take, flatMap, map, catchError, tap, filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { ConfirmationComponent } from '@app/shared/components/confirmation/confirmation.component';
import { _translate } from '@app/core/utils/translate.util';
import { ActivatedRoute, Router } from '@angular/router';
import { from, of, throwError } from 'rxjs';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { PromptChoice } from '@app/core/models/prompt-choice.interface';
import { PromptService } from '@app/shared/services/prompt.service';

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

	payments: Payment[] = []
	isLoading: boolean
	err: Error
	redirect: string
	planId: string

	constructor(
		private layoutService: LayoutService,
		private apiBillingService: ApiBillingService,
		private readonly route: ActivatedRoute,
		private router: Router,
		private spinnerService: SpinnerService,
		private userSettingsMiddleware: UserSettingsMiddlewareService,
		private translate: TranslateService,
		private promptService: PromptService,
	) { }

	ngOnInit() {
		this.redirect = this.route.snapshot.queryParamMap.get('redirect')
		this.planId = this.route.snapshot.queryParamMap.get('planId')
		this.isLoading = false
		this.spinnerService.hide()

		this.err = null
		this.getPaymentMethods().pipe(take(1)).subscribe((res: any) => {
			this.isLoading = false
			this.spinnerService.hide()
			this.err = null
			res && res.length === 0 ? this.addPaymentMethod() : null
		}, err => {
			console.error(err)
			this.isLoading = false
			this.spinnerService.hide()
			this.err = err && err.error || err
		})
	}

	onMakePrimary(payment: Payment) {
		this.isLoading = true

		this.err = null
		this.spinnerService.show()
		this.spinnerService.text = ''
		
		this.apiBillingService.updatePaymentMethod({isDefault: true}, payment.paymentMethodId).pipe(take(1)).subscribe(
			res => {
				this.isLoading = false
				this.spinnerService.hide()
				this.payments.forEach(p => {
					p.isDefault = false
				})
				payment.isDefault = true
				this.payments = _.sortBy(this.payments, 'isDefault').reverse()
			}, err => {
				this.isLoading = false
				this.spinnerService.hide()
				if (err.error.status >= 400) {
					this.err = err && err.error || err
				}
			}
		)
	}

	deletePayment(payment: Payment) {
		const message = this.translate.instant('pages.payment.delete_payment')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]

		this.promptService.prompt('', message, promptChoices).pipe(filter(res => res === 'yes')).subscribe(() => {
			this.spinnerService.text = _translate('spinner.removingPayment')
			this.spinnerService.show()
			this.isLoading = true
	
			this.err = null
			this.apiBillingService.deletePaymentMethod(payment.paymentMethodId)
				.pipe(
					take(1),
					flatMap(() => this.getPaymentMethods())
				)
				.subscribe(
					res => {
						this.isLoading = false
						this.spinnerService.hide()
						this.payments = _.sortBy(this.payments.filter(paymentMethod => paymentMethod.paymentMethodId !== payment.paymentMethodId), 'isDefault').reverse()
					}, err => {
						this.isLoading = false
						this.spinnerService.hide()
						if (err.error.status >= 400) {
							try {
								this.layoutService.openSnackBar(this.translate.instant(err.error.code), null, 5000, 'error')
							} catch (error) {
								this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
							}
	
						}
					}
				)
		})
		
	}


	getPaymentMethods() {
		this.spinnerService.show()
		this.spinnerService.text = ''
		
		this.isLoading = true

		return this.apiBillingService.listPaymentMethods().pipe(
			take(1),
			map(res => {
				this.payments = _.sortBy(res, 'isDefault').map(payment => ({
					...payment,
					expDate: new Date(parseInt(payment.expYear, 10), parseInt(payment.expMonth, 10))
				})).reverse()
				return this.payments
			}),
			catchError(err => {
				this.layoutService.openSnackBar(_translate('error.error_occured'), null, 5000, 'error')
				return throwError(err)
			})
		)
	}

	subscribePlan() {
		this.spinnerService.text = _translate('spinner.subscribe')
		this.spinnerService.show()
		this.isLoading = true

		try {
			if (this.planId) {
				const paymentMethodId: string = this.payments.find(x => x.isDefault).paymentMethodId
				return this.apiBillingService.subscribePlan({
					planId: this.planId,
					paymentMethodId
				}).pipe(
					take(1),
					flatMap(() => from(this.userSettingsMiddleware.sync())),
					catchError((error: HttpErrorResponse) => {
						if (error.error.status >= 400) {
							return throwError(error.error)
						}
					}),
					tap(() => console.log(`User has subscribe to plan ${this.planId}`)),
					map(() => true)
				)
			}
			else {
				return of(null)
			}
		}
		catch(err) {
			return of(null)
		}
	}

	addPaymentMethod() {
		this.err = null
		this.layoutService.openModal(PaymentModalContentComponent)
			.closed$
			.pipe(
				take(1),
				flatMap((res) => {
						if (res) {
							return this.getPaymentMethods()
						} else {
							return of(null)
						}
					}),
				flatMap((res) => {
					this.isLoading = false
					this.spinnerService.hide()

					if (res) {
						return this.layoutService.openModal(ConfirmationComponent, {
							icon: '<i class="fa fa-check"></i>',
							title: _translate('confirm.payment_success.title'),
							text: _translate('confirm.payment_success.subtitle'),
							backBtnText: _translate('confirm.payment_success.return')
						}).closed$
					}
					else {
						return of(null)
					}
				}),
				flatMap(() => this.subscribePlan()),
			)
			.subscribe((res) => {
				this.isLoading = false
				this.spinnerService.hide()
				this.err = null
				if (res && this.redirect) {
					this.router.navigate([ this.redirect ])
				}
			}, err => {
				console.error(err)
				this.isLoading = false
				this.spinnerService.hide()
				this.err = err && err.error || err
			})
	}

}
