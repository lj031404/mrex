import { Component, Input, OnInit, EventEmitter, AfterViewInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'

import { PropertyFormHelper } from '@app/helper/property-form-helper';
import { PurchaseInfoConfig, EconomicValuesConfig } from '@app/helper/configs/purchase-info-config';
import { FinancingCompany, EconomicValues } from '@app/api_generated';
import { BanksParametersService } from '@app/shared/services/banks-parameters.service';
import { takeWhile } from 'rxjs/operators';
import { _translate } from '@app/core/utils/translate.util';
import { DataInterface } from '@app/shared/components/financing-chart/financing-chart.component';
import { PropertyTransferTax } from '@app/shared/services/PropertyTaxTransfer/PropertyTaxTransfer';

@Component({
	selector: 'app-purchase-info',
	templateUrl: './purchase-info.component.html',
	styleUrls: ['./purchase-info.component.scss']
})
export class PurchaseInfoComponent implements OnInit, AfterViewInit {
	FinancingType = FinancingCompany
	PropertyFormHelper = PropertyFormHelper
	financingOptionKeys = Object.keys(FinancingCompany)
	checkFinancingParametersInit = false

	financingData$: EventEmitter<DataInterface[]> = new EventEmitter()
	checkFinancingParameters$: EventEmitter<boolean> = new EventEmitter()

	@Input() propertyAddForm: FormGroup
	@Input() purchaseInfoConfig: PurchaseInfoConfig
	@Input() isBaseModel: boolean

	form: FormGroup
	financingParametersControls: FormGroup

	banks = BanksParametersService.logos

	incomesCheck: boolean

	constructor(
		private fb: FormBuilder,
		private formHelper: PropertyFormHelper
	) { }

	ngOnInit() {

		if (this.purchaseInfoConfig.estimatedAcquisitionFees.total === null && this.purchaseInfoConfig.askPrice) {
			this.purchaseInfoConfig.estimatedAcquisitionFees.total = this.purchaseInfoConfig.askPrice * 0.015
		}

		this.form = this.fb.group({
			askPrice: [this.purchaseInfoConfig.askPrice, [Validators.required, Validators.min(1) ]],
			incomes: this.formHelper.createNestedItemListWithTotal(this.purchaseInfoConfig.incomes, [Validators.required, Validators.min(1)], []),
			vacancy: [this.purchaseInfoConfig.vacancy, [Validators.required, Validators.min(0)]],
			taxes: this.formHelper.createNestedItemListWithTotal(this.purchaseInfoConfig.taxes, [Validators.required, Validators.min(0)], []),
			insurance: [this.purchaseInfoConfig.insurance, [Validators.required, Validators.min(0)]],
			utilities: this.formHelper.createNestedItemListWithTotal(this.purchaseInfoConfig.utilities, [Validators.required, Validators.min(0)], []),
			otherExpenses: this.formHelper.createNestedItemListWithTotal(this.purchaseInfoConfig.otherExpenses, [Validators.min(0)], []),
			financingType: [this.purchaseInfoConfig.financingType, Validators.required],
			bank: [this.purchaseInfoConfig.bank, Validators.required],
			economicValues: new FormArray([]),
			estimatedAcquisitionFees: this.formHelper.createNestedItemListWithTotal(this.purchaseInfoConfig.estimatedAcquisitionFees, [Validators.required], []),
			economicValue: [],
			mortgage: [],
			cashdown: [],
			secondFinancing: this.fb.group({
				loanAmount: [ this.purchaseInfoConfig.secondFinancing.loanAmount, []],
				interestRate: [ this.purchaseInfoConfig.secondFinancing.interestRate, []],
				paymentsPerYear: [ this.purchaseInfoConfig.secondFinancing.paymentsPerYear, []],
				term: [ this.purchaseInfoConfig.secondFinancing.term, []],
				loanType: [ this.purchaseInfoConfig.secondFinancing.loanType, []],
				amortization: [ this.purchaseInfoConfig.secondFinancing.amortization, []],
				description: [ this.purchaseInfoConfig.secondFinancing.description, []],
				enabled: [ this.purchaseInfoConfig.secondFinancing.enabled, []],
			})
		})

		this.financingOptionKeys.forEach((bank, i) => {
			const formGroup = this.fb.group({
				qualificationRate: [ this.purchaseInfoConfig.economicValues[i].qualificationRate, [Validators.required, Validators.min(0)]],
				interestRate: [ this.purchaseInfoConfig.economicValues[i].interestRate, [Validators.required, Validators.min(0)]],
				DCR: [ this.purchaseInfoConfig.economicValues[i].DCR, [Validators.required, Validators.min(0)]],
				LTV: [ this.purchaseInfoConfig.economicValues[i].LTV, [Validators.required, Validators.min(0)]],
				amortization: [ this.purchaseInfoConfig.economicValues[i].amortization, [Validators.required, Validators.min(0)]],
				term: [ this.purchaseInfoConfig.economicValues[i].term, [Validators.required, Validators.min(0)]],

				// hidden
				financingCompany: [ this.purchaseInfoConfig.economicValues[i].financingCompany, [] ],
				managementRate: [ this.purchaseInfoConfig.economicValues[i].managementRate, [] ],
				vacancyRate: [ this.purchaseInfoConfig.economicValues[i].vacancyRate, [] ],
				yearlyMaintenancePerUnit: [ this.purchaseInfoConfig.economicValues[i].yearlyMaintenancePerUnit, [] ],
				yearlySalariesPerUnit: [ this.purchaseInfoConfig.economicValues[i].yearlySalariesPerUnit, [] ],
			})

			const formArray = this.form.controls.economicValues as FormArray
			formArray.insert(i, formGroup)
		})

		if (this.propertyAddForm) {
			this.propertyAddForm.addControl(
				'purchase',
				this.form
			)
		}

		if (this.financingType === 'ConventionalCustom') {
			this.checkFinancingParametersInit = true
		}
		else {
			this.checkFinancingParametersInit = true // true to be opened by default, false to be closed by default
		}

		// listen for residential units change
		this.updateIncomeConfigs()
		this.residentialUnits.valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((res) => {
				this.updateIncomeConfigs()
			})

		// listen for ask price change
		this.updateAcquisitionFees()
		this.form.controls.askPrice.valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((val) => {
				this.updateAcquisitionFees()
			})

		this.form.get('vacancy').valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((val) => {
				const economicValues = this.form.get('economicValues').value
				economicValues.forEach((x, i) => {
					const ev = (this.form.get('economicValues') as FormArray).at(i)
					const vacancyRate = this.form.get('vacancy').value
					ev.get('vacancyRate').setValue(vacancyRate)
				})
				this.updateAcquisitionFees()
			})

	}

	ngAfterViewInit() {
		// Calcutlate EV, etc.. if askPrice and income are defined
		if (this.form.get('askPrice').valid &&
			this.form.get('incomes').valid &&
			this.form.get('taxes').valid &&
			this.form.get('vacancy').valid &&
			this.form.get('insurance').valid) {
			this.calculateFinancingParametersChange()
		}

		// listen for any change, then recalculate EV, etc..
		this.form.valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((val) => {
				this.calculateFinancingParametersChange()
			})
	}

	get capRate() {
		// const financingParameters = this.form.getRawValue().financingParameters
		const index = BanksParametersService.getBankIndex(this.financingType)
		const economicValues = (this.form.get('economicValues') as FormArray).at(index).value as EconomicValues

		// calculate
		const calculation = EconomicValuesConfig.calculateEV(economicValues, this.propertyAddForm)
		console.log(calculation)
		return calculation.capRate
	}

	get financingType() {
		return this.propertyAddForm.getRawValue().purchase.financingType
	}

	// Enable / disable validation depending on checkbox status
	incomesCheckChange(check) {
		this.incomesCheck = check

		const validators = check ? [Validators.required, Validators.min(1)] : [];

		(this.form.get(['incomes', 'items']) as FormArray).controls
				.forEach((control: FormGroup) => {
					control.controls.amount.setValidators(validators)
					control.controls.amount.updateValueAndValidity()
				})
	}

	// Enable / disable validation depending on checkbox status
	taxesCheckChange(check) {

		const validators = check ? [Validators.required, Validators.min(1)] : [];

		(this.form.get(['taxes', 'items']) as FormArray).controls
				.forEach((control: FormGroup) => {
					control.controls.amount.setValidators(validators)
					control.controls.amount.updateValueAndValidity()
				})
	}

	// Enable / disable validation depending on checkbox status
	otherExpensesCheckChange(check) {

		const validators = check ? [] : [];

		(this.form.get(['otherExpenses', 'items']) as FormArray).controls
				.forEach((control: FormGroup) => {
					control.controls.amount.setValidators(validators)
					control.controls.amount.updateValueAndValidity()
				})
	}

	// Enable / disable validation depending on checkbox status
	utilitiesCheckChange(check) {

		const validators = check ? [] : [];

		(this.form.get(['utilities', 'items']) as FormArray).controls
				.forEach((control: FormGroup) => {
					control.controls.amount.setValidators(validators)
					control.controls.amount.updateValueAndValidity()
				})
	}

	// Enable / disable validation depending on checkbox status
	acquisitionFeesCheckChange(check) {

		const validators = check ? [] : [];

		(this.form.get(['estimatedAcquisitionFees', 'items']) as FormArray).controls
			.forEach((control: FormGroup) => {
				control.controls.amount.setValidators(validators)
				control.controls.amount.updateValueAndValidity()
			})
	}

	calculateFinancingParametersChange() {

		const financingData: DataInterface[] = [
			{
				label: 'helper.property-add.components.purchase-info.estimatedEV.label',
				key: 'EV',
				values: {}
			},
			{
				label: 'helper.property-add.components.purchase-info.cashdown.label',
				key: 'cashdown',
				values: {}
			},
			{
				label: 'helper.property-add.components.purchase-info.mortgageAmount.label',
				key: 'mortgageAmount',
				values: {}
			}
		]

		const calculations = {}
		const banks = [ ...new Set(['CHMC', 'Desjardins', this.financingType]) ]
		banks.forEach((bank, i) => {
			// const financingParameters = this.form.getRawValue().financingParameters
			const index = BanksParametersService.getBankIndex(bank)
			const economicValues = (this.form.get('economicValues') as FormArray).at(index).value as EconomicValues

			// calculate
			const calculation = EconomicValuesConfig.calculateEV(economicValues, this.propertyAddForm)
			calculations[bank] = calculation
		})
		financingData.forEach(indicator => {
			// maximum value for this indicator
			const max = Math.max(...banks.map(bank => calculations[bank][indicator.key]))
			const min = Math.min(...banks.map(bank => calculations[bank][indicator.key]))
			banks.forEach(bank => {
				const value: number = calculations[bank][indicator.key]
				const OFFSET = 0.5
				let relative = (value - min) / ((max - min)) + OFFSET
				relative = isNaN(relative) ? OFFSET : relative
				if (relative > 1) {
					relative = 1
				}
				const color = BanksParametersService.getColorForBank(bank)
				indicator.values['literals.financing.' + bank] = [ value, relative, color ]
			})
		})

		this.financingData$.emit(financingData)

		// update the exit capRate if undefined
		const exitCapRate = this.propertyAddForm.get('cashflow.futureFinancialParams').value.items.find(x => x.name === 'capRateYearThreeAndUp').amount
		if (!exitCapRate) {
			this.updateExitCapRate()
		}

	}

	onActive() {
	}

	// set exit cap rate same as entry capRate
	updateExitCapRate() {
		try {
			let idx = 0
			idx = this.propertyAddForm.get('cashflow.futureFinancialParams').value.items.findIndex(x => x.name === 'capRateYearThreeAndUp')

			// const financingParameters = this.form.getRawValue().financingParameters
			const index = BanksParametersService.getBankIndex(this.financingType)
			const economicValues = (this.form.get('economicValues') as FormArray).at(index).value as EconomicValues

			// calculate
			const { capRate } = EconomicValuesConfig.calculateEV(economicValues, this.propertyAddForm);

			(this.propertyAddForm.get('cashflow.futureFinancialParams.items') as FormArray).at(idx).get('amount').setValue(capRate * 100)
		}
		catch(err) {}
	}

	get residentialUnits() {
		return this.propertyAddForm.get(['property', 'residentialUnits'])
	}

	updateIncomeConfigs() {

		const incomes = this.form.get('incomes').value

		// The number of units has changed: rebuild form array
		if (this.residentialUnits.value !== incomes.items.length) {
			const newIncomes = this.purchaseInfoConfig.incomes.resetUnit(this.residentialUnits.value);

			// clear form array
			(this.form.get(['incomes', 'items']) as FormArray).clear()

			let validators = []
			if (this.incomesCheck) {
				validators = [ Validators.required, Validators.min(1) ]
			}

			newIncomes.items.forEach((item, i) => {
				const obj = {}
				Object.keys(item).forEach(k => {
					if (k === 'amount') {
						obj[k] = [ item[k], validators ]
					}
					else {
						obj[k] = item[k]
					}
				});
				(this.form.get(['incomes', 'items']) as FormArray).insert(i, this.fb.group( { ...obj }));
			})
		}
	}

	updateAcquisitionFees() {
		const estimatedAcquisitionFees = this.form.controls.estimatedAcquisitionFees.value

		// do not calculate the acquisition fees if some itemized values are set already
		const price = this.form.controls.askPrice.value
		if (price) {
			estimatedAcquisitionFees.items.forEach(x => {
				if (x.name === 'propertyTransferTax') {
					const city = this.propertyAddForm.getRawValue().property.address.city
					const propertyTransferTax = new PropertyTransferTax('CA_QC', city)
					x.amount = propertyTransferTax.calc(price)
				}
			})
			estimatedAcquisitionFees.total = PropertyFormHelper.sumOfItems(estimatedAcquisitionFees.items)
			this.form.controls.estimatedAcquisitionFees.setValue({ ...estimatedAcquisitionFees })
		}

		// set building inspector fees if they are null
		(this.form.get('estimatedAcquisitionFees.items') as FormArray).controls.forEach(x => {
			if (x.value.name === 'buildingInspector' && x.value.amount === null) {
				const units = this.residentialUnits.value
				x.get('amount').setValue(1000 + 100 * units)
			}
		})
	}

}

export const secondFinancingValidators = {
	loanAmount: [Validators.required, Validators.min(1)],
	interestRate: [Validators.required, Validators.min(0.01), Validators.max(100)],
	paymentsPerYear: [Validators.required, Validators.min(0)],
	term: [Validators.required, Validators.min(1)],
	loanType: [Validators.required, Validators.min(0)],
	amortization: [Validators.required, Validators.min(1)],
	description: [Validators.required, Validators.min(1)]
}
