import { PropertyItemizeControlConfig, PropertyItemizeGroupConfig, DropdownChoice } from '@app/helper/configs/property-itemize-config';
import { Expenses, GrossIncome, Hypothesis, ModelProperty, Lease, SecondaryFinancing, RefinancingInputs, RefinancingEconomicValues, HypothesisInput, Financials, EconomicValues, FinancingCompany } from '@app/api_generated';
import { Property } from '@app/core/models/property.interface';
import { PropertyInfoConfig } from './property-info-config';
import { PropertyFormHelper } from '../property-form-helper';
import { _translate } from '@app/core/utils/translate.util';
import { BanksParametersService } from '@app/shared/services/banks-parameters.service';
import { LoanTypeEnum } from '../../core/models/property-add.constants';

export class PurchaseInfoConfig {

	askPrice: number
	incomes: PropertyIncomeConfig
	vacancy = 5
	taxes: PropertyTaxConfig
	insurance: number = null
	utilities: PropertyUtilityConfig
	otherExpenses: OtherExpensesConfig
	financingType = FinancingCompany.CHMC
	bank = FinancingCompany.CHMC
	economicValues: EconomicValuesConfig[]
	estimatedAcquisitionFees: EstimatedAcquisitionFeeConfig
	secondFinancing: SecondFinancingConfig

	constructor(config?: PurchaseInfoConfig) {

		if (config) {
			this.askPrice = config.askPrice
			this.incomes = new PropertyIncomeConfig(config.incomes)
			this.vacancy = config.vacancy
			this.taxes = new PropertyTaxConfig(config.taxes)
			this.insurance = config.insurance
			this.utilities = new PropertyUtilityConfig(config.utilities)
			this.otherExpenses = new OtherExpensesConfig(config.otherExpenses)
			this.financingType = config.financingType
			this.bank = config.bank
			this.economicValues = config.economicValues.map(x => new EconomicValuesConfig(x))
			this.estimatedAcquisitionFees = new EstimatedAcquisitionFeeConfig(config.estimatedAcquisitionFees)
			this.secondFinancing = new SecondFinancingConfig(config.secondFinancing)
		} else {
			this.incomes = new PropertyIncomeConfig()
			this.taxes = new PropertyTaxConfig(null)
			this.utilities = new PropertyUtilityConfig()
			this.otherExpenses = new OtherExpensesConfig()
			this.economicValues = Array(BanksParametersService.financials.banks.length).fill(new EconomicValuesConfig())
			this.estimatedAcquisitionFees = new EstimatedAcquisitionFeeConfig()
			this.secondFinancing = new SecondFinancingConfig()
		}
	}

	init(property: ModelProperty, hypothesis?: Hypothesis) {
		const expenses = property.expenses

		this.askPrice = property.askPrice
		this.incomes.init(property.grossIncome)
		this.taxes.init(expenses)
		this.insurance =  expenses && expenses.insurance ? expenses.insurance : null
		this.utilities.init(expenses)
		this.otherExpenses.init(expenses)
		this.economicValues = this.resetEconomicValues(property)

		if (hypothesis && hypothesis.input) {
			// interest rate term 1
			const interestRate = hypothesis.input.termsInterestRates && hypothesis.input.termsInterestRates[0]

			this.vacancy = hypothesis.input.vacancyRate * 100
			this.financingType = hypothesis.input.financingCompany
			this.bank = hypothesis.input.bank
			this.economicValues = hypothesis.input.economicValues.map(x => new EconomicValuesConfig().init(x))
			this.estimatedAcquisitionFees.init(hypothesis.input)
			this.secondFinancing.init(hypothesis.input)
		}
	}

	getData(residentialUnits): { property: ModelProperty, hypothesis: HypothesisInput } {
		const property: Property = {}
		let hypothesis = {} as HypothesisInput

		const YEAR25 = 24

		property.grossIncome = this.incomes.getData()

		property.askPrice =  this.askPrice

		const incomeBreakdown = this.incomes.items.map(item => { return {
			rent: item.amount,
			unit: item.unit,
			suite: item.label,
			currency: 'CAD',
			type: 'residential'
		}}) as Lease[]
		const leases = incomeBreakdown

		property.grossIncome = {
			totalIncome: this.incomes.total,
			residentialIncome: this.incomes.total,
			incomeBreakdown: incomeBreakdown,
			currency: 'CAD',
			year: new Date().getFullYear()
		}

		let found

		found = this.taxes.items.find(t => t.name === 'municipalTax')
		const municipalTax = found ? found.amount : null

		found = this.taxes.items.find(t => t.name === 'schoolTax')
		const schoolTax = found ? found.amount : null

		found = this.utilities.items.find(t => t.name === 'electricity')
		const electricity = found ? found.amount : null

		found = this.utilities.items.find(t => t.name === 'naturalGas')
		const naturalGas = found ? found.amount : null

		found = this.utilities.items.find(t => t.name === 'oil')
		const oil = found ? found.amount : null

		let expenses: Expenses = {}

		expenses = {
			currency: 'CAD',
			year: new Date().getFullYear(),
			insurance: this.insurance || 0,
			...this.taxes.getData(),
			...this.utilities.getData(),
			...this.otherExpenses.getData(),
			oil: oil,
			energy: electricity + naturalGas + oil,
		}
		property.expenses = expenses

		property.leases = leases

		const economicValues = this.economicValues.map(x => x.getData())

		// Amortization rate (Canada rules)
		const amortizingTax = [ 0.02, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04 ]

		let rentMethod = 3
		try {
			rentMethod = (this.incomes.items.map(x => x.amount || 0) || []).reduce((a, b) => a + b) === 0 ? 3 : 1
		} catch (e) {}

		hypothesis = {
			rentMethod: rentMethod,
			askPrice: this.askPrice,
			numberOfUnits: property.residentialUnits,

			// ************ Expenses *************
			municipalTaxes: municipalTax || 0,
			schoolTaxes: schoolTax || 0,
			totalTaxes: this.taxes.total,

			insurance: this.insurance || 0,

			// Utilities
			electricity: electricity || 0,
			naturalGas: naturalGas || 0,
			totalUtilities: this.utilities.total,

			// We already know the financing company! We should not have to pass these parameters again!!
			// To be fixed on the API / calculator
			yearlyMaintenancePerUnit: economicValues.find(x => x.financingCompany === this.financingType).yearlyMaintenancePerUnit,
			yearlySalariesPerUnit: economicValues.find(x => x.financingCompany === this.financingType).yearlySalariesPerUnit,
			vacancyRate: economicValues.find(x => x.financingCompany === this.financingType).vacancyRate,
			managementRate: economicValues.find(x => x.financingCompany === this.financingType).managementRate,

			landscaping: 0, // 0, because it's already included in otherExpenses
			otherExpenses: this.otherExpenses.total || 0,

			monthlyRentsForFirstMethod: this.incomes.items.map(x => x.amount || 0),
			thirdMethodCurrentGrossIncome: this.incomes.total || 0,

			economicValues: economicValues,
			financingCompany: this.financingType as FinancingCompany,

			bank: this.bank as FinancingCompany,

			secondaryFinance: this.secondFinancing.getData(),

			// acquisition costs
			propertyTransferTax:   this.estimatedAcquisitionFees.items.find(x => x.name === 'propertyTransferTax'     ).amount || 0,
			notary:                this.estimatedAcquisitionFees.items.find(x => x.name === 'notaryTitleLawyer'       ).amount || 0,
			financingAndEscrowFee: this.estimatedAcquisitionFees.items.find(x => x.name === 'financingEscrowFees'     ).amount || 0,
			buildingInspection:    this.estimatedAcquisitionFees.items.find(x => x.name === 'buildingInspector'       ).amount || 0,
			otherAcquisitionCosts: this.estimatedAcquisitionFees.items.find(x => x.name === 'otherAcquisitionExpenses').amount || 0,
			chmc: 0,                                                                    // TODO. not in forms?? 1500 + 9% de la prime
			totalAcquisitionCosts: this.estimatedAcquisitionFees.total || 0,

			// expenseOptimisationInput: {},                                             // TODO: where should the information be? Not in forms.

			amortizingTax: amortizingTax,

			timingLiquidationYear: YEAR25,                                              // We assume the building is sold at year 25.

		} as HypothesisInput

		if (hypothesis.monthlyRentsForFirstMethod.reduce((acc, x) => acc + x) === 0) {
			delete hypothesis.monthlyRentsForFirstMethod
		}

		if (rentMethod === 1) {
			delete hypothesis.thirdMethodCurrentGrossIncome
		}

		return { property, hypothesis }
	}

	resetEconomicValues(property) {
		const economicValues = BanksParametersService.resetEconomicValues(property.residentialUnits)
		return economicValues.map(x => new EconomicValuesConfig(x))
	}

}


export class PropertyIncomeConfig implements PropertyItemizeGroupConfig {
	total: any = null
	items: PropertyItemizeControlConfig[] = []

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.total = config.total
			this.items = config.items || []
		}
	}

	init(grossIncome?: GrossIncome, itemize?: boolean) {
		this.total = grossIncome && grossIncome.totalIncome ? grossIncome.totalIncome : null

		if (grossIncome && grossIncome.incomeBreakdown) {
			this.items = grossIncome && grossIncome.incomeBreakdown.map((x: any, i) => {
				return {
					name: 'apt' + (i + 1),
					label: x.suite,
					amount: x.rent || 0,
					unit: x.unit,
					placeholder: 'literals._0$PerMonth',
					required: true,
					decimals: 0
				}
			})
		}
		if (itemize === true) {
			this.total = {
				value: this.total,
				disabled: true
			}
		}
	}

	resetUnit(units: number): PropertyIncomeConfig {
		const items: PropertyItemizeControlConfig[] = []

		for (let i = 0; i < units; i++) {
			items.push({
				name: 'apt' + (i + 1),
				label: 'Apt ' + (i + 1),
				amount: 0,
				unit: 'literals._$PerMonth',
				placeholder: 'literals._0$PerMonth',
				required: true,
				decimals: 0
			})
		}

		return new PropertyIncomeConfig({
			total: this.total,
			items
		})
	}

	getData(): GrossIncome {
		return {
			totalIncome: this.total || 0
		}
	}
}

export class PropertyTaxConfig implements PropertyItemizeGroupConfig {
	total: number = null
	items: PropertyItemizeControlConfig[] = []

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.total = config.total
			this.items = config.items
		} else {
			this.items = [
				{ name: 'municipalTax',
					label: 'purchase-info-config.municipalTax',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'schoolTax',
					label: 'purchase-info-config.schoolTax',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				}
			]
		}
	}

	init(expenses?: Expenses) {
		this.total = expenses && expenses.totalTaxes ? expenses.totalTaxes : null
		this.items[0].amount = expenses && expenses.municipalTax ? expenses.municipalTax : null
		this.items[1].amount = expenses && expenses.schoolTax ? expenses.schoolTax : null
	}

	getData(): Expenses {
		return {
			totalTaxes: this.total || 0,
			municipalTax: this.items[0].amount || 0,
			schoolTax: this.items[1].amount || 0
		}
	}
}

export class PropertyUtilityConfig implements PropertyItemizeGroupConfig {
	total: number = null
	items: PropertyItemizeControlConfig[] = []

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.total = config.total
			this.items = config.items
		} else {
			this.items = [
				{
					name: 'electricity',
					label: 'purchase-info-config.electricity',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'naturalGas',
					label:  'purchase-info-config.naturalGas',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
			]
		}
	}

	init(expenses?: Expenses) {
		this.total = expenses && expenses.totalUtilities
		this.items[0].amount = expenses && expenses.electricity
		this.items[1].amount = expenses && expenses.naturalGas
	}

	getData(): Expenses {
		return {
			totalUtilities: this.total || 0,
			electricity: this.items[0].amount || 0,
			naturalGas: this.items[1].amount || 0
		}
	}
}

export class EconomicValuesConfig {
	financingCompany: string
	qualificationRate: number = null
	interestRate: number = null
	DCR: number = null
	LTV: number = null
	amortization: number = null
	term = 5
	yearlyMaintenancePerUnit: number = null
	yearlySalariesPerUnit: number = null
	managementRate: number = null
	vacancyRate: number = null

	static calculateEV(economicValues: EconomicValues, propertyAddForm: any)
		: {
			EV: number,
			mortgageAmount: number,
			cashdown: number,
			capRate: number
		} {

			const numberOfUnits = propertyAddForm.getRawValue().property.residentialUnits
			const purchaseInfo = propertyAddForm.getRawValue().purchase

			const DCR = economicValues.DCR
			const LTV = economicValues.LTV / 100
			const qualificationRate = economicValues.qualificationRate / 100
			const vacancyRate = economicValues.vacancyRate / 100
			const maintenancePerUnit = economicValues.yearlyMaintenancePerUnit
			const salariesPerUnit = economicValues.yearlySalariesPerUnit
			const managementRate = economicValues.managementRate / 100
			const amortization = economicValues.amortization

			const askPrice = purchaseInfo.askPrice
			const grossIncome = purchaseInfo.incomes.total
			const acquisitionFees = purchaseInfo.estimatedAcquisitionFees.total

			const effectiveIncome = (1 - vacancyRate) * grossIncome
			const normalizedExpenses = purchaseInfo.taxes.total
										+ purchaseInfo.insurance
										+ purchaseInfo.utilities.total
										+ maintenancePerUnit * numberOfUnits
										+ salariesPerUnit * numberOfUnits
										+ managementRate * grossIncome
			const normalizedNetIncome = effectiveIncome - normalizedExpenses

			const mortgagePaymentTarget = normalizedNetIncome / DCR

			let EV = mortgagePaymentTarget * (( 1 - Math.pow(1 + qualificationRate, -amortization)) / qualificationRate) / LTV
			EV = EV < 0 ? 0 :  EV

			const minAmount = Math.min(...[ EV, askPrice ])
			const mortgageAmount = minAmount * LTV

			const cashdown = (askPrice > EV ? askPrice : minAmount) - mortgageAmount

			const capRate = normalizedNetIncome / askPrice

			return { EV, mortgageAmount, cashdown, capRate }
	}

	constructor(config?) {
		if (config) {
			Object.assign(this, config)
		}
	}

	init(economicValues: EconomicValues) {
		try {
			Object.assign(this, economicValues)
			Object.keys(this).forEach(k => {
				['qualificationRate', 'LTV', 'managementRate', 'vacancyRate', 'interestRate'].includes(k) ? this[k] *= 100 : 0
			})
			return this
		}
		catch (err) {
			console.error(err)
		}
	}

	getData(): EconomicValues {
		Object.keys(this).forEach(k => {
			['qualificationRate', 'LTV', 'managementRate', 'vacancyRate', 'interestRate'].includes(k) ? this[k] /= 100 : 0
		})
		this.amortization = Number(this.amortization)
		return JSON.parse(JSON.stringify(this))
	}
}

export class EstimatedAcquisitionFeeConfig implements PropertyItemizeGroupConfig {
	total: number = null
	items: PropertyItemizeControlConfig[] = []

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.total = config.total
			this.items = config.items
		} else {
			this.items = [
				{ name: 'propertyTransferTax', label: 'purchase-info-config.propertyTransferTax', amount: null, unit: '$', placeholder: '0 $', decimals: 0 },
				{ name: 'buildingInspector', label: 'purchase-info-config.buildingInspector', amount: null, unit: '$', placeholder: '0 $', decimals: 0 },
				{ name: 'notaryTitleLawyer', label: 'purchase-info-config.notaryTitleLawyer', amount: 1500, unit: '$', placeholder: '0 $', decimals: 0 },
				{ name: 'financingEscrowFees', label: 'purchase-info-config.financingEscrowFees', amount: null, unit: '$', placeholder: '0 $', decimals: 0 },
				{ name: 'otherAcquisitionExpenses', label: 'purchase-info-config.otherAcquisitionExpenses', amount: null, unit: '$', placeholder: '0 $', decimals: 0 }
			]
		}
	}

	init(hypothesisInput: HypothesisInput) {
		this.items = [
			{ name: 'propertyTransferTax', label: 'purchase-info-config.propertyTransferTax', amount: hypothesisInput.propertyTransferTax, unit: '$', placeholder: '0 $', decimals: 0 },
			{ name: 'buildingInspector', label: 'purchase-info-config.buildingInspector', amount: hypothesisInput.buildingInspection, unit: '$', placeholder: '0 $', decimals: 0 },
			{ name: 'notaryTitleLawyer', label: 'purchase-info-config.notaryTitleLawyer', amount: hypothesisInput.notary, unit: '$', placeholder: '0 $', decimals: 0 },
			{ name: 'financingEscrowFees', label: 'purchase-info-config.financingEscrowFees', amount: hypothesisInput.financingAndEscrowFee, unit: '$', placeholder: '0 $', decimals: 0 },
			{ name: 'otherAcquisitionExpenses', label: 'purchase-info-config.otherAcquisitionExpenses', amount: hypothesisInput.otherAcquisitionCosts, unit: '$', placeholder: '0 $', decimals: 0 }
		]

		this.total = PropertyFormHelper.sumOfItems(this.items)
	}
}

export class OtherExpensesConfig implements PropertyItemizeGroupConfig {
	total: number = null
	items: PropertyItemizeControlConfig[] = []

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.total = config.total
			this.items = config.items
		} else {
			this.items = [
				{
					name: 'landscaping',
					label: 'purchase-info-config.landscaping',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'snowRemoval',
					label: 'purchase-info-config.snowRemoval',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'publicity',
					label: 'purchase-info-config.publicity',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'appliancesRental',
					label: 'purchase-info-config.appliancesRental',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'waterTankRental',
					label: 'purchase-info-config.waterTankRental',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'elevators',
					label: 'purchase-info-config.elevators',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'accounting',
					label: 'purchase-info-config.accounting',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'legal',
					label: 'purchase-info-config.legal',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'telecom',
					label: 'purchase-info-config.telecom',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'maintenance',
					label: 'purchase-info-config.maintenance',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				},
				{
					name: 'other',
					label: 'purchase-info-config.other',
					amount: null,
					unit: 'literals._$PerYear',
					placeholder: '0',
					decimals: 0
				}
			]
		}
	}

	init(expenses?: Expenses) {

		this.total = expenses && expenses.totalOthers ? expenses.totalOthers : null
		this.items[0].amount = expenses && expenses.landscaping ? expenses.landscaping : null
		this.items[1].amount = expenses && expenses.snowRemoval ? expenses.snowRemoval : null
		this.items[2].amount = expenses && expenses.publicity ? expenses.publicity : null
		this.items[3].amount = expenses && expenses.appliancesRental ? expenses.appliancesRental : null
		this.items[4].amount = expenses && expenses.waterTankRental ? expenses.waterTankRental : null
		this.items[5].amount = expenses && expenses.elevators ? expenses.elevators : null
		this.items[6].amount = expenses && expenses.accounting ? expenses.accounting : null
		this.items[7].amount = expenses && expenses.legal ? expenses.legal : null
		this.items[8].amount = expenses && expenses.telecom ? expenses.telecom : null
		this.items[9].amount = expenses && expenses.maintenance ? expenses.maintenance : null
		this.items[10].amount = expenses && expenses.others ? 
			expenses.others.reduce((total, x) => total + x.amount, 0) + (expenses && expenses.other || 0)
			: (expenses && expenses.other || null)
	}

	getData(): Expenses {
		const expenses = {
			totalOthers: this.total || 0,
		}

		this.items.forEach(item => expenses[item.name] = item.amount)

		return expenses
	}
}

export class SecondFinancingConfig {
	loanAmount: number = null
	interestRate: number = null
	paymentsPerYear = 12
	term = 5
	loanType: number = LoanTypeEnum.FULLY_AMORTIZED
	amortization = 30
	description: string
	enabled = false

	constructor(config?: SecondFinancingConfig) {
		if (config) {
			this.loanAmount = config.loanAmount
			this.interestRate = config.interestRate
			this.paymentsPerYear = config.paymentsPerYear
			this.term = Number(config.term)
			this.loanType = Number(config.loanType)
			this.amortization = Number(config.amortization)
			this.description = config.description
			this.enabled = config.enabled
		}
	}

	init(hypothesisInput: HypothesisInput) {
		const secondaryFinance = hypothesisInput.secondaryFinance
		if (secondaryFinance.length) {
			this.loanAmount      = secondaryFinance[0].loanAmount
			this.interestRate    = secondaryFinance[0].interestRate
			this.paymentsPerYear = secondaryFinance[0].paymentsPerYear || 12
			this.term            = secondaryFinance[0].term || 5
			this.loanType        = secondaryFinance[0].loanType || LoanTypeEnum.FULLY_AMORTIZED
			this.amortization    = secondaryFinance[0].amortization || 30
			this.description     = secondaryFinance[0].description
			this.enabled         = secondaryFinance[0].loanAmount !== 0 || secondaryFinance[0].interestRate !== 0
		}
	}

	getData(): SecondaryFinancing[] {
		return this.enabled ? [
			{
				loanAmount: this.loanAmount,
				interestRate: this.interestRate,
				paymentsPerYear: this.paymentsPerYear,
				term: Number(this.term),
				loanType: Number(this.loanType),
				amortization: Number(this.amortization),
				description: this.description
			}
		] : []
	}
}
