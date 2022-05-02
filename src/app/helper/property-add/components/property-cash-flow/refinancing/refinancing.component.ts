import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { takeWhile, tap, flatMap, map, filter, merge, take, last, catchError, debounce } from 'rxjs/operators';
import { DropdownChoice } from '@app/helper/configs/property-itemize-config';
import { HypothesisService as HypothesisApiService } from '@app/api_generated/api/hypothesis.service';
import { Hypothesis } from '@app/api_generated';
import { PropertyFormConfig } from '@app/helper/property-form-config';
import { Observable, of, timer } from 'rxjs';
import { RefinancingValidators } from '../property-cash-flow.component';
import { Router } from '@angular/router';
import { PlansService } from '@app/shared/services/plans.service';
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-refinancing',
	templateUrl: './refinancing.component.html',
	styleUrls: ['./refinancing.component.scss']
})
export class RefinancingComponent implements OnInit, AfterViewInit {

	@Input() propertyAddForm: FormGroup
	@Input() isBaseModel: boolean

	enabled = false
	calculated
	cashflow: AbstractControl
	isCalculating = false
	errors: any = {}
	showLocked: boolean
	showSubscriptionRequired: boolean
	ruleId = 'watchlist.refinancing'

	timingValues: DropdownChoice[] = [
		{ value: 1, label: 'literals.1year' },
		{ value: 2, label: 'literals.2years' },
		{ value: 3, label: 'literals.3years' },
		{ value: 4, label: 'literals.4years' },
		{ value: 5, label: 'literals.5years' }
	]

	constructor(private hypothesisApiService: HypothesisApiService,
		private translate: TranslateService,
		private layoutService: LayoutService,
		private plansService: PlansService,
		private cd: ChangeDetectorRef) { }

	resetErrors() {
		this.errors = {
			balanceSecondaryFinancing: false,
			availableEquity: false,
			totalRefinancing: false,
			releasedLiquidity: false,
		}
	}

	ngOnInit() {
		this.cashflow = this.propertyAddForm.get('cashflow')

		this.enabled = this.cashflow.value.refinancingParameters.enabled

		if (this.enabled && !this.showLocked) {
			this.calculate().pipe(last()).subscribe()
		}

		if (!this.cashflow.value.refinancingParameters.refinancingType) {
			this.cashflow.get('refinancingParameters.refinancingType').setValue('CHMC')
		}
	}

	async ngAfterViewInit() {
		const { upgradeRequired, requiredPlan} = await this.plansService.minimumRequiredPlan(this.ruleId)
		this.showSubscriptionRequired = upgradeRequired
		this.showLocked = this.isBaseModel === true && !this.showSubscriptionRequired

		// ------------------- Listen for changes in the form, then recalculate -------------------
		// Whenever the fields are changing, set the field "refinancedEquity" to 0, except if that
		// field itself is changed
		let watchAttributes = []
		watchAttributes = Object
							.keys(this.propertyAddForm.get(['cashflow', 'refinancingParameters']).value)
							.filter(x => x !== 'refinancedEquity')
		let merges = watchAttributes.map(x => this.propertyAddForm.get(['cashflow', 'refinancingParameters', x]).valueChanges)

		// listen for changes in the previous tabs as well
		merges  = [
			...merges,
			this.propertyAddForm.get('property').valueChanges,
			this.propertyAddForm.get('purchase').valueChanges,
			this.propertyAddForm.get('cashflow.refinancingEconomicValues').valueChanges,
		]

		merges[0]
			.pipe(
				merge(...merges.splice(1)),
				// when other fields change, set refinancedEquity (loanAmount) to 0
				tap(() => this.propertyAddForm.get(['cashflow', 'refinancingParameters', 'refinancedEquity']).setValue(0)),
				tap(() => {
					if (this.isCalculating) {
						console.log('Calculating... skip new calculation')
					}
					if (!this.propertyAddForm.valid) {
						console.log('Form is invalid, cannot calculate')
					}
				}),
				// take the last event after X ms (as many other fields change got triggered)
				// ref: https://www.learnrxjs.io/learn-rxjs/operators/filtering/debounce
				takeWhile(() => Boolean(this.cashflow)),
				debounce(() => timer(250)),
				filter(() => this.enabled),
				filter(() => !this.showLocked),
				filter(() => !this.isCalculating),
				filter(() => this.propertyAddForm.valid),
				filter(() => this.propertyAddForm.value.cashflow.refinancingParameters.refinancingType),
				flatMap(() => this.calculate()),
			).subscribe()

		// recalculate on "loanAmount" field change
		this.propertyAddForm.get(['cashflow', 'refinancingParameters', 'refinancedEquity']).valueChanges
			.pipe(
				takeWhile(_ => Boolean(this.cashflow)),
				debounce(() => timer(250)),
				filter(() => this.enabled),
				filter(() => !this.showLocked),
				filter(() => !this.isCalculating),
				filter(() => this.propertyAddForm.valid),
				filter(() => this.propertyAddForm.value.cashflow.refinancingParameters.refinancingType),
				flatMap(() => this.calculate()),
			).subscribe()

	}

	toggleRefinanceCheck() {
		this.enabled = !this.enabled

		this.propertyAddForm.get(['cashflow', 'refinancingParameters', 'enabled']).setValue(this.enabled)

		this.setValidators()
	}

	setValidators() {
		// If second financing is is enabled, set the validatores to their original value, otherwise no validators are required
		Object.keys((this.propertyAddForm.get(['cashflow', 'refinancingParameters']) as any).controls)
			.forEach(controlName => {
				const validators = this.enabled ? RefinancingValidators[controlName] : []
				this.propertyAddForm.get(['cashflow', 'refinancingParameters', controlName]).setValidators(validators)
				this.propertyAddForm.get(['cashflow', 'refinancingParameters', controlName]).updateValueAndValidity()
			})

	}

	calculate(): Observable<any> {

		this.isCalculating = true
		this.cd.detectChanges()
		const formData = this.propertyAddForm.getRawValue()
		const formConfig: PropertyFormConfig = new PropertyFormConfig(formData)
		const { property, hypothesis } = formConfig.getData()

		return this.hypothesisApiService.addHypothesis(hypothesis, false)
			.pipe(
				take(1),
				map((res: Hypothesis) => {
					try {
						const timing = this.propertyAddForm.value.cashflow.refinancingParameters.timing * 12
						if (timing > 0) {
							this.resetErrors()

							const availableEquity = res.output.refinanceParameters[0].availableEquity

							const loanAmount = parseFloat(this.propertyAddForm.value.cashflow.refinancingParameters.refinancedEquity || 0)
							const mortgageBalance = parseFloat((res.output.firstMortgage[timing - 1] as any).beginBalancedPeriod)
							const totalRefinancing = loanAmount + mortgageBalance

							const beginBalancedPeriod = parseFloat((res.output.secondaryFinancingLoan1[timing - 1] as any).beginBalancedPeriod)

							const balanceSecondaryFinancing = beginBalancedPeriod > 0 ? beginBalancedPeriod - loanAmount : 0

							const releasedLiquidity = loanAmount - parseFloat((res.output.secondaryFinancingLoan1[timing - 1] as any).principal)

							// Report the NaN values so that the user knows there were errors
							this.errors.balanceSecondaryFinancing = isNaN(balanceSecondaryFinancing)
							this.errors.availableEquity 		  = isNaN(availableEquity)
							this.errors.totalRefinancing 	      = isNaN(totalRefinancing)
							this.errors.releasedLiquidity 		  = isNaN(releasedLiquidity)

							if (loanAmount > availableEquity) {
								this.layoutService.openSnackBar(this.translate.instant('helper.property-add.components.cash-flow.refinancing.error.exceedEquity'), null, 5000, 'error')
							}
							else {
								this.calculated = { availableEquity, totalRefinancing, balanceSecondaryFinancing, releasedLiquidity }
							}

						}

						this.isCalculating = false
						this.cd.detectChanges()
					}
					catch (err) {
						throw(err)
					}
				}),
				catchError((err) => {
					console.error(err)
					this.isCalculating = false

					// Report the NaN values so that the user knows there were errors
					this.errors.balanceSecondaryFinancing = true
					this.errors.availableEquity 		  = true
					this.errors.totalRefinancing 	      = true
					this.errors.releasedLiquidity 		  = true

					this.cd.detectChanges()
					return of(null)
				})
			)
	}

}
