import { Hypothesis, ModelProperty, HypothesisInput, RefinancingInputs, FinancingCompany } from '@app/api_generated';
import { PropertyItemizeControlConfig, PropertyItemizeGroupConfig } from '@app/helper/configs/property-itemize-config';
import { EconomicValuesConfig } from './purchase-info-config';
import { LoanTypeEnum } from '../../core/models/property-add.constants';
import { BanksParametersService } from '@app/shared/services/banks-parameters.service';

export class CashFlowInfoConfig {
	avgRents: number = null
	itemizedRent: PropertyRentConfig
	futureFinancialParams: FutureFinancingParameterConfig
	capex: CapexConfig
	opex: OpexConfig
	refinancingParameters: RefinancingParameterConfig
	refinancingEconomicValues: EconomicValuesConfig[]

	constructor(config?: CashFlowInfoConfig) {
		if (config) {
			this.avgRents = config.avgRents
			this.itemizedRent = new PropertyRentConfig(config.itemizedRent)
			this.futureFinancialParams = new FutureFinancingParameterConfig(config.futureFinancialParams)
			this.capex = new CapexConfig(config.capex)
			this.opex = new OpexConfig(config.opex),
			this.refinancingParameters = new RefinancingParameterConfig(config.refinancingParameters)
			this.refinancingEconomicValues = config.refinancingEconomicValues.map(x => new EconomicValuesConfig(x))
		} else {
			this.itemizedRent = new PropertyRentConfig()
			this.futureFinancialParams = new FutureFinancingParameterConfig()
			this.capex = new CapexConfig()
			this.opex = new OpexConfig()
			this.refinancingParameters = new RefinancingParameterConfig()
			this.refinancingEconomicValues = Array(BanksParametersService.financials.banks.length).fill(new EconomicValuesConfig())
		}
	}

	init(property: ModelProperty, hypothesis?: Hypothesis) {
		if (hypothesis && hypothesis.input) {
			this.itemizedRent.init(hypothesis.input)
			this.futureFinancialParams.init(hypothesis.input)
			this.capex.init(hypothesis.input)
			this.opex.init(hypothesis.input)
			this.refinancingParameters.init(hypothesis.input)
			this.refinancingEconomicValues = hypothesis.input.refinancingEconomicValues.map(x => new EconomicValuesConfig().init(x))
		}
	}

	getData(residentialUnits): { property: ModelProperty, hypothesis: HypothesisInput } {
		const property: ModelProperty = {}
		let hypothesis = {} as HypothesisInput

		const refinancingEconomicValues = this.refinancingEconomicValues.map(x => x.getData())

		// assuming term for financing is 5 years.
		// TODO: what if the user enters a 2 years financing and a refinancing at year 4 ? That would be a bug. It should be consecutive
		const term1 = this.refinancingParameters.timing || 5
		const term2 = 10 - term1
		const term = [ term1, term2 ]

		// An empty array means there are no refinancing enabled
		const refinancingParameters = this.refinancingParameters.getData() as any
		const ev = refinancingEconomicValues.find(x => x.financingCompany === refinancingParameters.refinancingType)
		refinancingParameters.qualificationRate = ev.qualificationRate
		refinancingParameters.amortization = ev.amortization
		const refinance = this.refinancingParameters.enabled ? [ refinancingParameters ] : []

		hypothesis = {
			rentIncreaseRate: [
				this.itemizedRent.items[0].amount / 100 || 0.02,
				this.itemizedRent.items[1].amount / 100 || 0.02,
				this.itemizedRent.items[2].amount / 100 || 0.02,
				this.itemizedRent.items[2].amount / 100 || 0.02,
				this.itemizedRent.items[2].amount / 100 || 0.02,
				this.itemizedRent.items[2].amount / 100 || 0.02
			],

			// Future parameters (check Spreadsheet)
			// Caprate if we sell each year. To estimate the market value
			// Formula: TGA de la fiche en cours * 1.1
			// Used in the calculation of the future value
			// https://app.slack.com/client/TF04RCR8V/GP7AJV9G8/thread/GP7AJV9G8-1586288996.004400
			capRateYearOne: 0.045,                                                       // TODO. not in forms (!!). Harcoded?? Exit cap rate??
			capRateYearTwo: 0.045,                                                       // TODO. not in forms (!!). Harcoded?? Exit cap rate??
			capRateYearThreeAndUp: this.futureFinancialParams.items.find(x => x.name === 'capRateYearThreeAndUp').amount / 100,

			expensesIncreaseRate: this.futureFinancialParams.items.find(x => x.name === 'expensesIncreaseRate').amount / 100,
			capitalGainsTax: this.futureFinancialParams.items.find(x => x.name === 'capitalGainsTax').amount / 100,
			personalIncomeTax: this.futureFinancialParams.items.find(x => x.name === 'personalIncomeTax').amount / 100,
			landToBuildingRatio: this.futureFinancialParams.items.find(x => x.name === 'landToBuildingRatio').amount / 100,
			commission: this.futureFinancialParams.items.find(x => x.name === 'commission').amount / 100,            // commission de l'agent
			npvDiscountRate: this.futureFinancialParams.items.find(x => x.name === 'npvDiscountRate').amount / 100,
			reinvestmentRate: this.futureFinancialParams.items.find(x => x.name === 'reinvestmentRate').amount / 100,

			// CAPEX
			monthlyCapitalExpendituresBreakdown: this.capex.getData(),

			// OPEX
			monthlyMaintenanceBreakdown: this.opex.getData(),

			// Voir les règles de la régie du logement
			// See: https://www.rdl.gouv.qc.ca/fr/actualites/le-calcul-de-l-augmentation-des-loyers-en-2019
			// Tableau 3
			stabilizedRentIncreaseRate: 0.02,                                           // TODO. not in forms (!!). Harcoded. OK.

			expenseProjectionMethod: 1,                                                 // 1 (all expenses increase at same rate)

			refinance,
			refinanceFee: 0,                                                            // TODO: assumed to be the same
			refinancingEconomicValues,

			term,

		} as HypothesisInput

		return { property, hypothesis }
	}
}

export class PropertyRentConfig implements PropertyItemizeGroupConfig {
	items: PropertyItemizeControlConfig[]

	static calcAvgRentsPerYear(avgRent: number, incYear1: number, incYear2: number, incYear3: number)
		: {
			avgRent: number,
			avgRentYear1: number,
			avgRentYear2: number,
			avgRentYear3: number,
			avgRentYear4: number,
			avgRentYear5: number
		} {
		const avgRentInc1 = incYear1 / 100
		const avgRentYear1 = avgRent * (1 + avgRentInc1)

		const avgRentInc2 = incYear2 / 100
		const avgRentYear2 = avgRent * (1 + avgRentInc1) * (1 + avgRentInc2)

		const avgRentInc3 = incYear3 / 100
		const avgRentYear3 = avgRent * (1 + avgRentInc1) * (1 + avgRentInc2) * (1 + avgRentInc3)

		const avgRentInc4 = incYear3 / 100
		const avgRentYear4 = avgRent * (1 + avgRentInc1) * (1 + avgRentInc2) * (1 + avgRentInc3) * (1 + avgRentInc4)

		const avgRentInc5 = incYear3 / 100
		const avgRentYear5 = avgRent * (1 + avgRentInc1) * (1 + avgRentInc2) * (1 + avgRentInc3) * (1 + avgRentInc4) * (1 + avgRentInc5)

		return {
			avgRent,
			avgRentYear1,
			avgRentYear2,
			avgRentYear3,
			avgRentYear4,
			avgRentYear5
		}
	}

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.items = config.items
		} else {
			const DEFAULT_INCREASE = 2
			this.items = [
				{ name: 'increaseYear1', label: 'helper.property-add.components.cash-flow.increaseYear1', amount: DEFAULT_INCREASE, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'increaseYear2', label: 'helper.property-add.components.cash-flow.increaseYear2', amount: DEFAULT_INCREASE, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'increaseYear3', label: 'helper.property-add.components.cash-flow.increaseYear3', amount: DEFAULT_INCREASE, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'avgRentsYear1', label: 'Average rents year 1', amount: DEFAULT_INCREASE, disabled: true, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'avgRentsYear2', label: 'Average rents year 2', amount: DEFAULT_INCREASE, disabled: true, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'avgRentsYear3', label: 'Average rents year 3', amount: DEFAULT_INCREASE, disabled: true, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'avgRentsYear4', label: 'Average rents year 4', amount: DEFAULT_INCREASE, disabled: true, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'avgRentsYear5', label: 'Average rents year 5', amount: DEFAULT_INCREASE, disabled: true, unit: '$', placeholder: '0', decimals: 0 },
			]
		}
	}

	init(hypothesisInput: HypothesisInput) {
		this.items.map((item, i) => {
			switch (item.name) {
				case 'increaseYear1':
					item.amount = hypothesisInput.rentIncreaseRate[0] * 100
					break
				case 'increaseYear2':
					item.amount = hypothesisInput.rentIncreaseRate[1] * 100
					break
				case 'increaseYear3':
					item.amount = hypothesisInput.rentIncreaseRate[2] * 100
					break
			}
		})
	}
}


export class RefinancingParameterConfig {
	timing: number = null
	qualificationRate: number = null
	refinancedEquity: number = null
	loanType: number = LoanTypeEnum.FULLY_AMORTIZED
	refinancingType: FinancingCompany = FinancingCompany.CHMC
	refinancingBank: FinancingCompany = FinancingCompany.Desjardins
	amortization: number = null
	enabled = false

	constructor(config?) {
		if (config) {
			this.timing = Number(config.timing)
			this.qualificationRate = config.qualificationRate
			this.refinancedEquity = config.refinancedEquity
			this.loanType = config.loanType || LoanTypeEnum.FULLY_AMORTIZED // default to 4 as it's not defined in the forms
			this.refinancingType = config.refinancingType
			this.refinancingBank = config.refinancingBank
			this.amortization = config.amortization
			this.enabled = config.enabled
		}
	}

	init(hypothesisInput) {
		const refinance = hypothesisInput.refinance
		this.timing = refinance.length && Number(refinance[0].timing) / 12
		this.qualificationRate = refinance.length && refinance[0].qualificationRate * 100
		this.refinancedEquity = refinance.length && refinance[0].loanAmount || 0
		this.loanType = refinance.length && refinance[0].loanType
		this.refinancingType = refinance.length && refinance[0].refinancingType || FinancingCompany.CHMC
		this.refinancingBank = refinance.length && refinance[0].refinancingBank || FinancingCompany.Desjardins
		this.amortization = refinance.length && refinance[0].amortization
		this.enabled = refinance.length > 0
	}

	getData(): RefinancingInputs {
		return {
			amortization: Number(this.amortization),
			qualificationRate: this.qualificationRate,
			timing: Number(this.timing) * 12,                           // timing is in months (form is in year)
			loanAmount: this.refinancedEquity,
			loanType: this.loanType as RefinancingInputs.LoanTypeEnum,
			refinancingType: this.refinancingType as FinancingCompany,  // bank ID
			refinancingBank: this.refinancingBank as FinancingCompany,  // bank ID
			paymentsPerYear: 12,
			term: 5,                                                    // default term of the refinancing
		}
	}
}

export class FutureFinancingParameterConfig implements PropertyItemizeGroupConfig {
	items: PropertyItemizeControlConfig[] = []

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.items = config.items
		} else {
			const prefix = 'helper.property-add.components.property-cashflow.futureFinancialParams.'
			this.items = [
				{ name: 'expensesIncreaseRate', label: prefix + 'expensesIncreaseRate' , amount: 1.6, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'capRateYearThreeAndUp', label: prefix + 'capRateYearThreeAndUp', amount: 4.5, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'capitalGainsTax', label: prefix + 'capitalGainsTax', amount: 25, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'personalIncomeTax', label: prefix + 'personalIncomeTax', amount: 30, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'landToBuildingRatio', label: prefix + 'landToBuildingRatio', amount: 70, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'commission', label: prefix + 'commission', amount: 6, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'npvDiscountRate', label: prefix + 'npvDiscountRate', amount: 8, unit: '%', placeholder: '0', decimals: 1 },
				{ name: 'reinvestmentRate', label: prefix + 'reinvestmentRate', amount: 2, unit: '%', placeholder: '0', decimals: 1 }
			]
		}
	}

	init(hypothesisInput: HypothesisInput) {
		this.setItem('expensesIncreaseRate', hypothesisInput.expensesIncreaseRate)
		this.setItem('capRateYearThreeAndUp', hypothesisInput.capRateYearThreeAndUp)
		this.setItem('capitalGainsTax', hypothesisInput.capitalGainsTax)
		this.setItem('personalIncomeTax', hypothesisInput.personalIncomeTax)
		this.setItem('landToBuildingRatio', hypothesisInput.landToBuildingRatio)
		this.setItem('commission', hypothesisInput.commission)
		this.setItem('npvDiscountRate', hypothesisInput.npvDiscountRate)
		this.setItem('reinvestmentRate', hypothesisInput.reinvestmentRate)
	}

	setItem(name, value) {
		try {
			this.items.forEach((item: any) => {
				if (item.name === name) {
					item.amount = value * 100
				}
			})
		}
		catch (err) {
			console.error(err)
		}
	}

}

export class CapexConfig implements PropertyItemizeGroupConfig {
	items: PropertyItemizeControlConfig[] = []

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.items = config.items
		} else {
			this.items = [
				{ name: 'year1', label: 'helper.property-add.components.property-cash-flow.capex.year1', amount: null, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'year2', label: 'helper.property-add.components.property-cash-flow.capex.year2', amount: null, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'year3', label: 'helper.property-add.components.property-cash-flow.capex.year3', amount: null, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'year4', label: 'helper.property-add.components.property-cash-flow.capex.year4', amount: null, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'year5', label: 'helper.property-add.components.property-cash-flow.capex.year5', amount: null, unit: '$', placeholder: '0', decimals: 0 },
			]
		}
	}

	init(hypothesisInput: HypothesisInput) {
		this.setItem('year1', hypothesisInput.monthlyCapitalExpendituresBreakdown[11])
		this.setItem('year2', hypothesisInput.monthlyCapitalExpendituresBreakdown[23])
		this.setItem('year3', hypothesisInput.monthlyCapitalExpendituresBreakdown[35])
		this.setItem('year4', hypothesisInput.monthlyCapitalExpendituresBreakdown[47])
		this.setItem('year5', hypothesisInput.monthlyCapitalExpendituresBreakdown[59])
	}

	setItem(name, value) {
		try {
			this.items.forEach((item: any) => {
				if (item.name === name) {
					item.amount = value
				}
			})
		}
		catch (err) {
			console.error(err)
		}
	}

	getData() {
		const months = new Array(60).fill(0)
		this.items.forEach((x, i) => months[(i * 12) + 11] = x.amount || 0)
		return months
	}
}

export class OpexConfig implements PropertyItemizeGroupConfig {
	items: PropertyItemizeControlConfig[] = []

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.items = config.items
		} else {
			this.items = [
				{ name: 'year1', label: 'helper.property-add.components.property-cash-flow.opex.year1', amount: null, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'year2', label: 'helper.property-add.components.property-cash-flow.opex.year2', amount: null, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'year3', label: 'helper.property-add.components.property-cash-flow.opex.year3', amount: null, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'year4', label: 'helper.property-add.components.property-cash-flow.opex.year4', amount: null, unit: '$', placeholder: '0', decimals: 0 },
				{ name: 'year5', label: 'helper.property-add.components.property-cash-flow.opex.year5', amount: null, unit: '$', placeholder: '0', decimals: 0 },
			]
		}
	}

	init(hypothesisInput: HypothesisInput) {
		this.setItem('year1', hypothesisInput.monthlyMaintenanceBreakdown[11])
		this.setItem('year2', hypothesisInput.monthlyMaintenanceBreakdown[23])
		this.setItem('year3', hypothesisInput.monthlyMaintenanceBreakdown[35])
		this.setItem('year4', hypothesisInput.monthlyMaintenanceBreakdown[47])
		this.setItem('year5', hypothesisInput.monthlyMaintenanceBreakdown[59])
	}

	setItem(name, value) {
		try {
			this.items.forEach((item: any) => {
				if (item.name === name) {
					item.amount = value
				}
			})
		}
		catch (err) {
			console.error(err)
		}
	}

	getData() {
		const months = new Array(60).fill(0)
		this.items.forEach((x, i) => months[(i * 12) + 11] = x.amount || 0)
		return months
	}
}
