import { Component, OnInit } from '@angular/core';

import { LayoutService } from '@app/layout/service/layout.service';
import { ConfirmationComponent } from '@app/shared/components/confirmation/confirmation.component';
import { _translate } from '@app/core/utils/translate.util';
import { BillingService as ApiBillingService } from '@app/api_generated/api/billing.service'
import { UsersService as ApiUserService } from '@app/api_generated/api/users.service'
import { take, flatMap, catchError, map, switchMap, delay } from 'rxjs/operators';
import { BillPlan } from '@app-models/subscription.interface';
import { Error } from '@app-models/err.interface';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService as UserDBService } from '@app/core/localDB/user.service';
import { User } from '@app/api_generated';
import { Payment } from '@app-models/billing.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { from, throwError } from 'rxjs';
import { RouterMap } from '@app/core/utils/router-map.util';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { GlobalService } from '@app-services/global.service';
import { Plans } from './plans'
import { TranslateService } from '@ngx-translate/core';
import { PromptService } from '@app/shared/services/prompt.service';
import { PromptChoice } from '@app/core/models/prompt-choice.interface';
import { MatDialog } from '@angular/material';
import { PlanLevels } from '@app/shared/services/plans.service';
@Component({
	selector: 'app-subscription',
	templateUrl: './subscription.component.html',
	styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
	plans: BillPlan[] = []
	isLoading: boolean
	err: Error
	defaultPayment: Payment
	userDBInfo: User
	paymentMethods: Payment[] = []
	redirect: string
	subscriptionPlans = Plans;
	activeTabChange: boolean = true

	constructor(
		private layoutService: LayoutService,
		private apiBillingService: ApiBillingService,
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private userService: ApiUserService,
		private userDBService: UserDBService,
		private spinnerService: SpinnerService,
		private userSettingsMiddleware: UserSettingsMiddlewareService,
		private globalService: GlobalService,
		private translate: TranslateService,
		private promptService: PromptService,
		public dialog: MatDialog
	) {
		this.redirect = this.route.snapshot.queryParamMap.get('redirect')
		this.userSettingsMiddleware.userLanguageSettingEvent.subscribe((res) => {
			this.getPlans()
		})
	}

	async ngOnInit() {
		this.spinnerService.text = ''
		this.isLoading = true
		this.spinnerService.show(0, 0)
		try {
			this.paymentMethods = await this.apiBillingService.listPaymentMethods().toPromise()
			if (this.paymentMethods.length) {
				this.defaultPayment = this.paymentMethods.find(payment => payment.isDefault)
			}
		} catch (error) {
			this.layoutService.openSnackBar(_translate('error.error_occured'), null, 5000, 'error')
		}

		await this.getPlans()
		this.spinnerService.hide()
		this.isLoading = false
	}

	async onCancelClick(plan: BillPlan) {
		const message = this.translate.instant('pages.settings.subscription.cancel_subscription_cancel')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]

		const res = await this.promptService.prompt('', message, promptChoices).toPromise()

		if (res === 'yes') {
			this.isLoading = true
			this.spinnerService.text = _translate('spinner.unsubscribe')
			this.spinnerService.show()

			this.apiBillingService.unsubscribePlan({}).pipe(
				take(1),
				flatMap(() => {
					return this.userService.getUser()
				}),
				map(async (userInfo) => {
					this.userDBInfo = userInfo
					this.isLoading = false
					this.spinnerService.hide()
					this.userDBService.save(userInfo)
				}),
				switchMap(() => this.layoutService.openModal(ConfirmationComponent, {
					imgUrl: 'assets/images/membershipCancel.png',
					title: _translate('notification.cancel_membership.title'),
					text: _translate('notification.cancel_membership.subtitle'),
					backBtnText: _translate('pages.subscription.complete'),
					reActionText: _translate('pages.subscription.resubscribe')
				}).closed$),
				delay(1000),
				catchError((error: HttpErrorResponse) => {
					this.isLoading = false
					this.spinnerService.hide()
					if (error && error.error.status >= 400) {
						this.err = error.error
					}
					return throwError(error)
				})
			).subscribe(
				(res) => {
					if (res) {
						this.purchase(plan)
					}
				},
				err => {
					console.error(err)
					this.spinnerService.hide()
					this.err = err
				}
			)
		}

	}

	async getPlans() {
		try {
			const res = await this.apiBillingService.listBillingPlans().toPromise()
			this.plans = _.sortBy(res, 'amount').map(plan => ({
				...plan,
				isChecked: false,
				planName: `plans.${plan.nickname}`,
				metadataList: this.buildTemplate(plan).filter(item => item),
				description: `page.subscription.${plan.nickname}_description`,
				interValText: this.translate.instant(`page.subscription.${plan.interval}`)
			}))
			this.userDBInfo = await this.userSettingsMiddleware.sync()
			const planParam = this.route.snapshot.queryParamMap.get('plan')
			if (planParam) {
				this.plans.find(plan => plan.nickname === planParam).isChecked = true
			} else if (this.userDBInfo.subscription.plan && this.activeTabChange) {
				if (this.plans.find(plan => plan.nickname === this.userDBInfo.subscription.plan)) {
					this.plans.find(plan => plan.nickname === this.userDBInfo.subscription.plan).isChecked = true
				}

			} else {
				this.plans.find(plan => plan.nickname === PlanLevels.BASIC).isChecked = true
			}

		} catch (error) {
			if (error.error && error.error.status >= 400) {
				this.err = error.error
			}
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'info')
		}
	}

	buildTemplate(plan: BillPlan) {
		if (plan.nickname.toLowerCase() === PlanLevels.BASIC) {
			plan.metadata = Object.assign(plan.metadata, {
				choose_between_accquisitions: null,
				marketplace: null,
				portfolio: null,
			})
		}
		if (plan.nickname.toLowerCase() === PlanLevels.VERIFIED) {
			plan.metadata = Object.assign(plan.metadata, {
				statistical_data_on_listings: null,
				equity_alert: null
			})
		}
		if (plan.nickname.toLowerCase() === PlanLevels.PREMIUM) {
			plan.metadata = Object.assign(plan.metadata, {
				advanced_stats: null,
			})
		}
		if (plan.nickname.toLowerCase() === PlanLevels.PRO) {
			plan.metadata = Object.assign(plan.metadata, {
				ai_powered_stats: null,
				advanced_home_screen: null,
				unlimited_stats_data: null,
				expert_portfolio_robo: null
			})
		}

		return this.subscriptionPlans[plan.nickname].map(item => {
			return {
				...item,
				key: `page.subscription.${item.id}`,
				value: plan.metadata[item.id] === '1000000' ? 'unlimited' : plan.metadata[item.id],
				fullText: plan.metadata[item.id] !== '1000000' ? `page.subscription.${item.id}.value` : `page.subscription.${item.id}.value_unlimited`,
				planText: this.translate.instant(plan.metadata[item.id] !== '1000000' ? `page.subscription.${item.id}.value` : `page.subscription.${item.id}.value_unlimited`, {
					count: plan.metadata[item.id] === '1000000' ? 'unlimited' : plan.metadata[item.id] > 0 ? plan.metadata[item.id] : '',
					count2: plan.metadata[item.id] === '1000000' ? 'unlimited' : plan.metadata[item.id]
				})
			}
		})
	}

	selectPlan(selectedPlan: BillPlan) {
		if (selectedPlan.nickname.toLowerCase() !== PlanLevels.PRO) {
			this.activeTabChange = false
		} else {
			this.activeTabChange = true
		}
		this.plans.forEach(plan => {
			if (plan.id === selectedPlan.id) {
				plan.isChecked = true
			} else {
				plan.isChecked = false
			}
		})

		this.router.navigate([`/subscription`], {
			queryParams: {
				plan: selectedPlan.nickname
			}
		})
	}

	async purchase(selectedPlan: BillPlan) {
		// A payment method already exist
		if (this.paymentMethods.length && this.defaultPayment) {
			const message = this.translate.instant('pages.settings.purchase_confirmation', {
				plan: this.translate.instant(selectedPlan.planName)
			})
			const promptChoices: PromptChoice[] = [
				{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
				{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
			]

			const res = await this.promptService.prompt('', message, promptChoices).toPromise()

			if (res === 'yes') {
				this.isLoading = true
				this.spinnerService.text = _translate('spinner.subscribe')
				this.spinnerService.show()
				this.apiBillingService.subscribePlan({
					planId: selectedPlan.id,
					paymentMethodId: this.defaultPayment.paymentMethodId
				}).pipe(
					take(1),
					flatMap(() => from(this.userSettingsMiddleware.sync())),
					map((userDBInfo) => {
						this.userDBInfo = userDBInfo
					}),
					catchError((error: HttpErrorResponse) => {
						this.isLoading = false
						this.spinnerService.hide()
						if (error.error.status >= 400) {
							this.err = error.error
						}
						return throwError(error)
					})
				).subscribe(() => {
					this.isLoading = false
					this.spinnerService.hide()
					this.err = null
					this.globalService.playSound('subscription')
					this.layoutService.openModal(ConfirmationComponent, {
						icon: '',
						imgUrl: 'assets/images/confirm_subscription.png',
						mainTitle: _translate('notification.success_membership.congratulations'),
						title: _translate(`notification.${selectedPlan.nickname}_success_membership.title`),
						text: _translate('notification.success_membership.subtitle'),
						backBtnText: _translate('page.settings.subscription.start'),
						onConfirmClick: this.goto.bind(this)
					})
				})
			}

		}
		// No payment method added yet
		else {
			this.router.navigate(['/settings/payment'], {
				queryParams: {
					redirect: this.redirect || RouterMap.Subscription.path,
					planId: selectedPlan.id
				}
			})
		}
	}

	goto() {
		this.globalService.stopSound()

		if (this.redirect) {
			this.router.navigate([this.redirect])
		}
	}

	navigateToPropertyScreen = () => {
		this.router.navigate([RouterMap.Watchlist.url([])])
	}

	availablePlan(currentPlan: BillPlan) {
		if (!this.userDBInfo.subscription.plan) {
			return true
		} else {
			return currentPlan.amount >= this.plans.find(plan => plan.nickname === this.userDBInfo.subscription.plan).amount
		}

	}

}
