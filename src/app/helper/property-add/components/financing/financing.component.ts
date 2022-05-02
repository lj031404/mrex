import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { BanksParametersService } from '@app/shared/services/banks-parameters.service';
import { DropdownChoice } from '@app/helper/configs/property-itemize-config';
import { takeWhile } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FinancingCompany } from '@app/api_generated';

const InitAmortizationValue: DropdownChoice[] = [
	{ value: 25, label: 'literals.25years' },
	{ value: 30, label: 'literals.30years' },
	{ value: 35, label: 'literals.35years' },
	{ value: 40, label: 'literals.40years' }
]

@Component({
	selector: 'app-financing',
	templateUrl: './financing.component.html',
	styleUrls: ['./financing.component.scss']
})
export class FinancingComponent implements OnInit {

	public isInsured: boolean

	@Input() propertyAddForm: FormGroup
	@Input() financingType: AbstractControl
	@Input() bank: AbstractControl
	@Input() economicValues: FormArray
	@Input() isBaseModel: boolean

	planName: string
	featureName: string

	enabled: any = {
		qualificationRate: true,
		interestRate: true,
		DCR: true,
		LTV: true,
		amortization: true,
		term: true,
	}

	ltvValues: DropdownChoice[] = [
		{ value: 65, label: '65 %' },
		{ value: 70, label: '70 %' },
		{ value: 75, label: '75 %' },
		{ value: 80, label: '80 %' },
		{ value: 85, label: '85 %' }
	]

	amortizationValues: DropdownChoice[] = InitAmortizationValue

	termValues: DropdownChoice[] = [
		{ value: 1, label: 'literals.1year' },
		{ value: 2, label: 'literals.2years' },
		{ value: 3, label: 'literals.3years' },
		{ value: 4, label: 'literals.4years' },
		{ value: 5, label: 'literals.5years' },
		{ value: 10, label: 'literals.10years' }
	]

	constructor(private translate: TranslateService, private router: Router) {}

	ngOnInit() {
		this.planName = this.translate.instant('plans.Verified')
		this.featureName = this.translate.instant('purchase-info-config.financing.featureName')

		// set the default financing parameters if unset (creation mode)
		this.updateFinancingParameters(this._bank)

		this.overwriteCHMCValues()

		this.propertyAddForm.get('property.residentialUnits').valueChanges
			.pipe(takeWhile(() => Boolean(this.propertyAddForm)))
			.subscribe(() => {
				this.overwriteCHMCValues()
			})
	}

	// get the bank ID array index
	get _financingTypeIndex() {
		let index = 0
		BanksParametersService.banksIds.forEach((id, i) => {
			id === this._financingType ? index = i : null
		})
		return index
	}

	get _financingType() {
		return this.financingType.value
	}

	get _bank() {
		return this.bank.value
	}

	set _financingType(financingType: string) {
		this.financingType.setValue(financingType)
	}

	get residentialUnits() {
		return this.propertyAddForm.get('property.residentialUnits').value
	}

	// parameters for the selected bank
	get bankParams() {
		const params = BanksParametersService.defaultParameters(this.residentialUnits)
		return params[this._financingType]
	}

	get disabledBanks() {
		return this.isBaseModel ? BanksParametersService.logos.map(x => x.name).filter(x => x !== FinancingCompany.CHMC) : []
	}

	onInsuredChange(event) {
		this.isInsured = event.detail.checked
		if (this._financingType === FinancingCompany.CHMC && !this.isInsured) {
			this._financingType = FinancingCompany.Desjardins
		}
		else if (this.isInsured) {
			this._financingType = FinancingCompany.CHMC
		}
		this.updateFinancingParameters(this._financingType)
	}

	reset() {
		this._financingType = FinancingCompany.Desjardins
	}

	overwriteCHMCValues() {
		const economicValues = BanksParametersService.resetEconomicValues(this.residentialUnits)
		economicValues.forEach((x, i) => {
			if (x.financingCompany === 'CHMC') {
				this.economicValues.at(i).get('DCR').setValue(x.DCR)
				this.economicValues.at(i).get('LTV').setValue(x.LTV)
				this.economicValues.at(i).get('yearlySalariesPerUnit').setValue(x.yearlySalariesPerUnit)
				this.economicValues.at(i).get('managementRate').setValue(x.managementRate)
			}
		})
	}

	updateFinancingParameters(financingType?: string) {
		if (financingType) {
			this.bank.setValue(financingType)
			this._financingType = financingType
			this.isInsured = financingType === FinancingCompany.CHMC
			if (this.isInsured) {
				this._financingType = FinancingCompany.CHMC
				this.amortizationValues = InitAmortizationValue
			}
			else {
				this.amortizationValues = this.amortizationValues.filter(x => [35, 40].includes(x.value as number))
			}
		}

		// ****************************** Fields to enable ****************************** //
		// enable for all banks
		this.enabled.qualificationRate = this.enabled.interestRate = true

		// enabled fields for custom only
		this.enabled.LTV = this.enabled.term = this._financingType === 'ConventionalCustom'

		// enable amortization for CHMC and custom
		this.enabled.amortization = ['ConventionalCustom', 'CHMC'].includes(this._financingType)

		// enable DCR for Desjardins and custom
		this.enabled.DCR = ['ConventionalCustom', 'Desjardins'].includes(this._financingType)

	}

}
