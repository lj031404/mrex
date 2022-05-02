import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoanTypeEnum } from '../../../../../core/models/property-add.constants';
import { DropdownChoice } from '@app/helper/configs/property-itemize-config';
import { secondFinancingValidators } from '../purchase-info.component';
import { takeWhile } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';

@Component({
	selector: 'app-second-financing',
	templateUrl: './second-financing.component.html',
	styleUrls: ['./second-financing.component.scss']
})
export class SecondFinancingComponent implements OnInit {
	@Input() propertyAddForm: FormGroup
	@Input() isBaseModel: boolean

	enabled = false
	secondFinancingType: string
	monthlyPayments = 0

	featureName: string

	showAmortization = true

	termValues = [
		{ value: 1, label: 'literals.1year' },
		{ value: 2, label: 'literals.2years' },
		{ value: 3, label: 'literals.3years' },
		{ value: 4, label: 'literals.4years' },
		{ value: 5, label: 'literals.5years' }
	]

	loanTypes = [
		{ value: LoanTypeEnum.FULLY_AMORTIZED, label: 'literals.loanTypes.FULLY_AMORTIZED' },
		{ value: LoanTypeEnum.INTEREST_ONLY, label: 'literals.loanTypes.INTEREST_ONLY' },
		// Not for now 0 this is too complicated for most users
		/*{ value: LoanTypeEnum.PARTLY_AMORTIZING, label: 'literals.loanTypes.PARTLY_AMORTIZING' },*/
		{ value: LoanTypeEnum.ZERO_COUPON, label: 'literals.loanTypes.ZERO_COUPON' }
	]

	amortizationValues: DropdownChoice[] = [
		{ value: 25, label: 'literals.25years' },
		{ value: 30, label: 'literals.30years' },
		{ value: 35, label: 'literals.35years' },
		{ value: 40, label: 'literals.40years' }
	]


	constructor(private translate: TranslateService, private router: Router) { }

	ngOnInit() {
		this.featureName = this.translate.instant('helper.property-add.components.purchase-info.secondary-financing.featureName')

		this.enabled = this.propertyAddForm.getRawValue().purchase.secondFinancing.enabled

		this.showAmortization = this.hasAmortization(this.propertyAddForm.getRawValue().purchase.secondFinancing.loanType)

		this.propertyAddForm.get(['purchase', 'secondFinancing', 'loanType']).valueChanges
			.pipe(takeWhile(() => Boolean(this.propertyAddForm)))
			.subscribe((val) => {
				this.showAmortization = this.hasAmortization(val)
			})

		this.setValidators()

	}

	hasAmortization(loanType: string) {
		// do not show amortization for Zeron Coupon and interest only
		return ![ LoanTypeEnum.ZERO_COUPON, LoanTypeEnum.INTEREST_ONLY ].includes(Number(loanType))
	}

	toggleCheck() {
		this.enabled = !this.enabled

		this.propertyAddForm.get(['purchase', 'secondFinancing', 'enabled']).setValue(this.enabled)

		if (!this.enabled) {
			this.reset()
		}

		this.setValidators()
	}

	setValidators() {
		// If second financing is is enabled, set the validatores to their original value, otherwise no validators are required
		Object.keys((this.propertyAddForm.get(['purchase', 'secondFinancing']) as any).controls)
			.forEach(controlName => {
				const validators = (this.enabled && !this.isBaseModel) ? secondFinancingValidators[controlName] : []
				this.propertyAddForm.get(['purchase', 'secondFinancing', controlName]).setValidators(validators)
				this.propertyAddForm.get(['purchase', 'secondFinancing', controlName]).updateValueAndValidity()
			})
	}

	updateSecondFinancingParameters() {
		console.log('update second financing')
	}

	reset() {
		this.propertyAddForm.get(['purchase', 'secondFinancing', 'loanAmount']).setValue(0)
		this.propertyAddForm.get(['purchase', 'secondFinancing', 'interestRate']).setValue(10)
		this.propertyAddForm.get(['purchase', 'secondFinancing', 'term']).setValue(5)
		this.propertyAddForm.get(['purchase', 'secondFinancing', 'loanType']).setValue(LoanTypeEnum.FULLY_AMORTIZED)
		this.propertyAddForm.get(['purchase', 'secondFinancing', 'amortization']).setValue(30)
		this.propertyAddForm.get(['purchase', 'secondFinancing', 'description']).setValue('')
	}

}
