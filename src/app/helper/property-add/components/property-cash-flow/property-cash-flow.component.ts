import { Component, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { takeWhile } from 'rxjs/operators'

import { CashFlowInfoConfig, PropertyRentConfig } from '@app/helper/configs/cash-flow-info-config';
import { PropertyFormHelper } from '@app/helper/property-form-helper';
import { PropertyItemizeControlConfig } from '@app/helper/configs/property-itemize-config';
import { FinancingCompany } from '@app/api_generated';
import { BanksParametersService } from '@app/shared/services/banks-parameters.service';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';

@Component({
	selector: 'app-property-cash-flow',
	templateUrl: './property-cash-flow.component.html',
	styleUrls: ['./property-cash-flow.component.scss']
})
export class PropertyCashFlowComponent implements OnInit {
	FinancingType = FinancingCompany
	financingOptionKeys = Object.keys(this.FinancingType)

	@Input() propertyAddForm: FormGroup
	@Input() cashflow: CashFlowInfoConfig
	@Input() isBaseModel: boolean

	form: FormGroup

	itemizeRents = true
	rentItemControls: FormArray

	futureFinancialParamControls: FormArray

	calculatedAvgRent = 0

	featureName: string

	constructor(
		private fb: FormBuilder,
		private formHelper: PropertyFormHelper,
		private translate: TranslateService
	) { }

	ngOnInit() {
		this.featureName = this.translate.instant('helper.property-add.components.cash-flow.title')

		this.form = this.fb.group({
			avgRents: [{ value: this.cashflow.avgRents, disabled: true }, Validators.required],
			itemizedRent: this.formHelper.createNestedItemList(this.cashflow.itemizedRent, Validators.required),
			futureFinancialParams: this.formHelper.createNestedItemList(this.cashflow.futureFinancialParams, [ Validators.required, Validators.min(0) ]),
			capex: this.formHelper.createNestedItemList(this.cashflow.capex, [Validators.min(0)]),
			opex: this.formHelper.createNestedItemList(this.cashflow.opex, [Validators.min(0)]),
			refinancingEconomicValues: new FormArray([]),
			refinancingParameters: this.fb.group({
				timing: [ { value: this.cashflow.refinancingParameters.timing, disabled: false } ],
				refinancedEquity: [ { value: this.cashflow.refinancingParameters.refinancedEquity, disabled: false } ],
				refinancingType:  [ this.cashflow.refinancingParameters.refinancingType, []],
				loanType: [ this.cashflow.refinancingParameters.loanType, []],
				enabled: [ this.cashflow.refinancingParameters.enabled, []],
				refinancingBank: [this.cashflow.refinancingParameters.refinancingBank, Validators.required],
			})
		})

		this.financingOptionKeys.forEach((bank, i) => {
			const formGroup = this.fb.group({
				qualificationRate: [ this.cashflow.refinancingEconomicValues[i].qualificationRate, [Validators.required, Validators.min(0)]],
				interestRate: [ this.cashflow.refinancingEconomicValues[i].interestRate, [Validators.required, Validators.min(0)]],
				DCR: [ this.cashflow.refinancingEconomicValues[i].DCR, [Validators.required, Validators.min(0)]],
				LTV: [ this.cashflow.refinancingEconomicValues[i].LTV, [Validators.required, Validators.min(0)]],
				amortization: [ this.cashflow.refinancingEconomicValues[i].amortization, [Validators.required, Validators.min(0)]],
				term: [ this.cashflow.refinancingEconomicValues[i].term, [Validators.required, Validators.min(0)]],

				// hidden
				financingCompany: [ this.cashflow.refinancingEconomicValues[i].financingCompany, [] ],
				managementRate: [ this.cashflow.refinancingEconomicValues[i].managementRate, [] ],
				vacancyRate: [ this.cashflow.refinancingEconomicValues[i].vacancyRate, [] ],
				yearlyMaintenancePerUnit: [ this.cashflow.refinancingEconomicValues[i].yearlyMaintenancePerUnit, [] ],
				yearlySalariesPerUnit: [ this.cashflow.refinancingEconomicValues[i].yearlySalariesPerUnit, [] ],
			})

			const formArray = this.form.controls.refinancingEconomicValues as FormArray
			formArray.insert(i, formGroup)
		})

		// if some fields are invalid, reset the refinancingEconomicValues form
		if (this.form.get('refinancingEconomicValues').invalid) {
			console.log('Resetting refinancingEconomicValues')
			const residentialUnits = this.propertyAddForm.getRawValue().property.residentialUnits
			const defaultEconomicValues = BanksParametersService.resetEconomicValues(residentialUnits)
			const formArray = this.form.controls.refinancingEconomicValues as FormArray
			defaultEconomicValues.forEach((x, i) => formArray.at(i).setValue(x))
		}

		if (this.propertyAddForm) {
			this.propertyAddForm.addControl(
				'cashflow',
				this.form
			)
		}

		this.rentItemControls = (this.form.controls.itemizedRent as FormGroup).controls.items as FormArray
		this.futureFinancialParamControls = (this.form.controls.futureFinancialParams as FormGroup).controls.items as FormArray

		this.setupRentIncreasesRelation()

		this.initFutureFinancialParams()

		// When the building width and heigh change, update the landToBuildingRatio
		merge(
			this.propertyAddForm.get('property.footageHeight').valueChanges,
			this.propertyAddForm.get('property.footageWidth').valueChanges,
		).pipe(takeWhile(() => Boolean(this.form))).subscribe(() => {
			this.initFutureFinancialParams()
		})

	}

	initFutureFinancialParams() {
		this.futureFinancialParamControls.controls.forEach(x => {
			if (x.value && x.value.name === 'landToBuildingRatio') {
				const lotArea: number = this.propertyAddForm.get('property.lotArea').value
				const buildingArea: number = this.propertyAddForm.get('property.buildingArea').value
				if (lotArea && buildingArea) {
					x.get('amount').setValue(buildingArea / lotArea * 100)
				}
			}
		})
	}

	onActive() {

		this.calculateAvgRentFromPrevSteps()
		this.form.controls.avgRents.setValue(this.calculatedAvgRent)

		try {
			const rentValues = this.form.controls.itemizedRent.value as PropertyItemizeControlConfig[]
			this.form.controls.itemizedRent.setValue(rentValues.map(rv => ({
				...rv,
				amount: null
			})), { emitEvent: false })
		} catch (err) {}
	}

	onRentItemizeCheck(checked: boolean) {
		this.itemizeRents = checked

		if (checked) {
			this.calculateAvgRentWithItemIncreases()
		} else {
			this.form.controls.avgRents.setValue(this.calculatedAvgRent)
		}
	}

	setupRentIncreasesRelation() {

		// detect change on 3 fields for % of increase
		this.rentItemControls.controls[0].valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((val) => {
				this.calculateAvgRentWithItemIncreases()
			})
		this.rentItemControls.controls[1].valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((val) => {
				this.calculateAvgRentWithItemIncreases()
			})
		this.rentItemControls.controls[2].valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((val) => {
				this.calculateAvgRentWithItemIncreases()
			})

	}

	calculateAvgRentFromPrevSteps() {
		const totalRents = this.propertyAddForm.get(['purchase', 'incomes']).get('total').value || 0
		const totalUnits = this.propertyAddForm.get(['property', 'residentialUnits']).value || 1

		this.calculatedAvgRent = totalRents / totalUnits / 12

		this.calculateAvgRentWithItemIncreases()
	}

	calculateAvgRentWithItemIncreases() {
		const items: PropertyItemizeControlConfig[] = this.rentItemControls.controls.map(x => x.value)

		const incFirstYear: number = items[0].amount as number || 0
		const incSecondYear: number = items[1].amount as number || 0
		const incThirdYear: number = items[2].amount as number || 0

		const calculation = PropertyRentConfig.calcAvgRentsPerYear(this.calculatedAvgRent, incFirstYear, incSecondYear, incThirdYear)

		items[3].amount = calculation.avgRentYear1
		items[4].amount = calculation.avgRentYear2
		items[5].amount = calculation.avgRentYear3
		items[6].amount = calculation.avgRentYear4
		items[7].amount = calculation.avgRentYear5

		// normalize decimals
		items.forEach(item => item.amount = item.amount)
		const avgRent = calculation.avgRent

		this.form.controls.avgRents.setValue(avgRent)

		for (let i = 3; i < 7; i++) {
			this.rentItemControls.controls[i].get('amount').setValue(items[i].amount)
		}

	}

}

export const RefinancingValidators = {
	interestRate: [Validators.required, Validators.min(0)],
	qualificationRate: [Validators.required, Validators.min(0)],
	DCR: [Validators.required, Validators.min(0)],
	LTV: [Validators.required, Validators.min(0)],
	amortization: [Validators.required, Validators.min(0)],
	term: [Validators.required, Validators.min(0)],
	timing: [],
	refinancedEquity: [],
	vacancy:  [],
	refinancingType: [],
	loanType: [],
	enabled: [],
}
