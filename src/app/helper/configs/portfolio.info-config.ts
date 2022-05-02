import { Address, ModelProperty, ResidentialDistribution, CoordinatePoint, Currency } from '@app/api_generated'
import { PropertyItemizeControlConfig, PropertyItemizeGroupConfig } from '@app/helper/configs/property-itemize-config'
import { PropertyType } from '@app/core/models/property.interface'
import { Portfolio } from '@app-core/models/portfolio.interface'
import { PorfolioPrimaryFinancing, ReceiveOfferStatus, PorfolioSecondaryFinancing, Expenses, Lease } from '@app/api_generated'
import { LoanTypeEnum } from '../../core/models/property-add.constants'
import { OtherIncome } from '@app/api_generated/model/otherIncome'
export class PortfolioConfig {

	_id = null
	propertyId = ''
	inheritedFrom = null
	placeId: string
	address: AddressConfig = new AddressConfig()
	type = ''
	propertyType = ''
	yearOfConstruction: number = null
	floors: number = null
	footageWidth: number = null
	footageHeight: number = null
	parent: string = null
	residentialUnits: number = null

	residentialDistribution: ResidentialDistributionConfig = new ResidentialDistributionConfig()
	expenses: ExpensesConfig = new ExpensesConfig()
	purchasePrice: number = null
	purchaseDate: Date = null
	primaryFinancing: PrimaryFinancingConfig = new PrimaryFinancingConfig()
	secondaryFinancing: SecondaryFinancingConfig = new SecondaryFinancingConfig()
	leases: LeasesConfig = new LeasesConfig()
	receiveOfferStatus: ReceiveOfferStatus = null
	lotDimension?: string
	otherIncome?: any
	floorArea?: number = null 

	constructor(config?: PortfolioConfig) {
		if (config) {
			let dimensionSplit = []
			if (config.lotDimension) {
				dimensionSplit = config.lotDimension.split('x')
			}

			this._id = config._id,
			this.propertyId = config.propertyId,
			this.placeId = config.placeId,
			this.inheritedFrom = config.inheritedFrom,
			this.address = new AddressConfig(config.address)
			this.type = config.propertyType
			this.propertyType = config.propertyType
			this.yearOfConstruction = config.yearOfConstruction
			this.floors = config.floors
			this.footageWidth = config.footageWidth
			this.footageHeight = config.footageWidth
			this.parent = config.parent
			this.residentialUnits = config.residentialUnits
			this.floorArea = config.floorArea
			if (config.residentialDistribution && config.residentialDistribution.items) {
				this.residentialDistribution = new ResidentialDistributionConfig(config.residentialDistribution)
			} else {
				this.residentialDistribution.init(config.residentialDistribution as ResidentialDistribution )
			}

			this.purchaseDate = config.purchaseDate
			this.purchasePrice = config.purchasePrice
			this.primaryFinancing = new PrimaryFinancingConfig(config.primaryFinancing)
			this.type = config.type
			this.expenses = new ExpensesConfig(config.expenses)
			this.secondaryFinancing = new SecondaryFinancingConfig(config.secondaryFinancing)
			this.leases = new LeasesConfig(config.leases)
			this.receiveOfferStatus = config.receiveOfferStatus
			try {
				if (config.otherIncome) {
					this.otherIncome = Object.keys(config.otherIncome).map(key => ({
						type: key,
						amount: config.otherIncome[key]
					})); 
				}
			} catch (error) {
				
			}
		
		}
	}

	init(portfolio: Portfolio) {
		let dimensionSplit = []
		if (portfolio.lotDimension) {
			dimensionSplit = portfolio.lotDimension.split('x')
		}

		this._id = portfolio._id
		this.propertyId = portfolio.propertyId
		this.inheritedFrom = portfolio.inheritedFrom
		this.address.init(portfolio.address)

		this.parent = portfolio.parent || null
		this.type = portfolio.propertyType || ''
		this.propertyType = portfolio.propertyType
		this.yearOfConstruction = portfolio.yearOfConstruction || null
		this.floors = portfolio.floors || null
		this.footageWidth = dimensionSplit[0] ? parseInt(dimensionSplit[0], 10) || null : null
		this.footageHeight = dimensionSplit[1] ? parseInt(dimensionSplit[1], 10) || null : null
		this.residentialUnits = portfolio.residentialUnits || (portfolio as any).dwellings || null // legacy support (dwellings)
		this.residentialDistribution.init(portfolio.residentialDistribution)
		this.purchaseDate = portfolio.purchaseDate ? portfolio.purchaseDate : null
		this.purchasePrice = portfolio.purchasePrice ? portfolio.purchasePrice : null
		this.primaryFinancing.init(portfolio.primaryFinancing)
		this.secondaryFinancing.init(portfolio.secondaryFinancing)
		this.leases.init(portfolio.leases)
		this.expenses.init(portfolio.expenses)
		this.receiveOfferStatus = portfolio.receiveOfferStatus ? portfolio.receiveOfferStatus : null
		this.floorArea = portfolio.floorArea ? portfolio.floorArea : null

		try {
			if (portfolio.grossIncome && portfolio.grossIncome.otherIncome) {
				this.otherIncome = portfolio.grossIncome.otherIncome
			}
		} catch (error) {
			
		}
		
		if (!this.type && this.residentialUnits) {
			if (this.residentialUnits >= 2 && this.residentialUnits <= 4) {
				this.type = 'Plex'
			}
			else if (this.residentialUnits >= 5) {
				this.type = PropertyType.multifamilyResidential
				// TODO: what about MultifamilyMixedUse ??
			}
		}
	}

	getData(): { portfolio: Portfolio } {
		let portfolio: Portfolio = {}

		const SQFT_TO_M2 = 0.092903
		const FT_TO_M = 0.3048

		const address = this.address.getData()

		try {
			[ address.civicNumber, address.civicNumber2 ] = address.civicNumber.split('-')
		}
		catch (err) {}

		portfolio._id = this._id
		portfolio.propertyId = this.propertyId
		portfolio.placeId = this.placeId
		portfolio.inheritedFrom = this.inheritedFrom
		portfolio.address = this.address.getData()
		portfolio.propertyType = this.propertyType as any
		portfolio.yearOfConstruction = this.yearOfConstruction
		portfolio.floors = this.floors
		portfolio.parent = this.parent
		portfolio.lotDimension = `${ this.footageWidth || 0 }x${ this.footageHeight || 0 }`
		portfolio.footageWidth = this.footageWidth
		portfolio.footageHeight = this.footageHeight
		portfolio.residentialUnits = this.residentialUnits || 0
		portfolio.residentialDistribution = this.residentialDistribution.getData()
		portfolio.buildingArea = (this.footageWidth * this.footageHeight) * SQFT_TO_M2
		portfolio.buildingDimension = FT_TO_M * this.footageWidth + 'x' + FT_TO_M * this.footageHeight
		portfolio.purchaseDate = this.purchaseDate
		portfolio.purchasePrice = this.purchasePrice
		portfolio.primaryFinancing = this.primaryFinancing
		portfolio.secondaryFinancing = new SecondaryFinancingConfig(this.secondaryFinancing)
		portfolio.leases = this.leases.getData()
		portfolio.receiveOfferStatus = this.receiveOfferStatus
		portfolio.expenses = this.expenses.getData()
		portfolio = {
			...portfolio,
			grossIncome : {
				otherIncome : this.otherIncome
			}
		}
		portfolio.floorArea = this.floorArea

		return { portfolio }
	}
}

export class ResidentialDistributionConfig implements PropertyItemizeGroupConfig {

	items: PropertyItemizeControlConfig[] =  [
		{ name: 'units15', label: '1.5', amount: null, decimals: 0  },
		{ name: 'units25', label: '2.5', amount: null, decimals: 0  },
		{ name: 'units35', label: '3.5', amount: null , decimals: 0 },
		{ name: 'units45', label: '4.5', amount: null, decimals: 0  },
		{ name: 'units55', label: '5.5', amount: null, decimals: 0  },
		{ name: 'units65', label: '6.5', amount: null, decimals: 0  }
	]

	constructor(config?: PropertyItemizeGroupConfig) {
		if (config) {
			this.items = config.items || []
		} else {
			this.items = [
				{ name: 'units15', label: '1.5', amount: null, decimals: 0  },
				{ name: 'units25', label: '2.5', amount: null, decimals: 0  },
				{ name: 'units35', label: '3.5', amount: null , decimals: 0 },
				{ name: 'units45', label: '4.5', amount: null, decimals: 0  },
				{ name: 'units55', label: '5.5', amount: null, decimals: 0  },
				{ name: 'units65', label: '6.5', amount: null, decimals: 0  }
			]
		}
	}

	init(distribution: ResidentialDistribution) {
		const residentialDistribution = distribution || ({} as ResidentialDistribution);

		this.items = [
			{ name: 'units15', label: '1.5', amount: residentialDistribution['_1'] || null, decimals: 0  },
			{ name: 'units25', label: '2.5', amount: residentialDistribution['_2'] || null, decimals: 0  },
			{ name: 'units35', label: '3.5', amount: residentialDistribution['_3'] || null, decimals: 0  },
			{ name: 'units45', label: '4.5', amount: residentialDistribution['_4'] || null, decimals: 0  },
			{ name: 'units55', label: '5.5', amount: residentialDistribution['_5'] || null, decimals: 0  },
			{ name: 'units65', label: '6.5', amount: residentialDistribution['_6'] || null, decimals: 0  }
		]
	}

	getData(): ResidentialDistribution {
		return {
			'_1': this.items[0].amount || 0,
			'_2': this.items[1].amount || 0,
			'_3': this.items[2].amount || 0,
			'_4': this.items[3].amount || 0,
			'_5': this.items[4].amount || 0,
			'_6': this.items[5].amount || 0
		}
	}

}

export class LeasesConfig {
	leases: Lease[] = []

	constructor(config?: any) {
		this.leases = config && config.map(lease => ({
			...lease,
			inclusion: lease.inclusion.map(item => {
				if (typeof item === 'string') {
					return item
				} else {
					return item[Object.keys(item)[0]] && Object.keys(item)[0] as any // TODO type issue?
				}
			}).filter(i => i)
		})) || []
	}

	init(leases) {
		this.leases = leases || []
	}

	getData() {
		return this.leases
	}
}

export class PrimaryFinancingConfig {

	financingType: string = 'CHMC'
	initialAmount: number = null
	insured: boolean = false
	firstPaymentDate: Date = null
	term: number = null
	amortization: number = null
	interestRate: number = null

	constructor(config?: PorfolioPrimaryFinancing) {
		if (config) {
			this.financingType = config.financingType
			this.initialAmount = config.initialAmount
			this.insured = config.insured
			this.firstPaymentDate = config.firstPaymentDate
			this.term = config.term
			this.amortization = config.amortization
			this.interestRate = config.interestRate
		} else {
			this.financingType = null
			this.initialAmount = null
			this.insured = false
			this.firstPaymentDate = null
			this.term = null
			this.amortization = null
			this.interestRate = null
		}
	}

	init(primaryFinancing: PorfolioPrimaryFinancing) {
		this.financingType = primaryFinancing && primaryFinancing.financingType || null
		this.initialAmount = primaryFinancing && primaryFinancing.initialAmount || null
		this.insured = primaryFinancing && primaryFinancing.insured || false
		this.firstPaymentDate = primaryFinancing && primaryFinancing.firstPaymentDate || null
		this.term = primaryFinancing && primaryFinancing.term || null
		this.amortization = primaryFinancing && primaryFinancing.amortization || null
		this.interestRate = primaryFinancing && primaryFinancing.interestRate * 100 || null
	}

	getData() {
		return {
			financingType: this.financingType,
			initialAmount: this.initialAmount,
			insured: this.insured,
			firstPaymentDate: this.firstPaymentDate,
			term: this.term,
			amortization: this.amortization,
			interestRate: this.interestRate
		}
	}

}

class TaxConfig implements PropertyItemizeGroupConfig {
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

	getData(): { totalTaxes: Number, municipalTax: Number, schoolTax: number } {
		return {
			totalTaxes: this.total || 0,
			municipalTax: this.items[0].amount || 0,
			schoolTax: this.items[1].amount || 0
		}
	}
}

export class UtilityConfig implements PropertyItemizeGroupConfig {
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
		this.items[10].amount = expenses && expenses.other ? expenses.other : null
	}

	getData(): any {
		const expenses = {
			totalOthers: this.total || 0,
		}

		this.items.forEach(item => expenses[item.name] = item.amount)

		return expenses
	}
}

export class SecondaryFinancingConfig {
	interestRate: number = null
	initialAmount = null
	term = 5
	loanType: PorfolioSecondaryFinancing.LoanTypeEnum = LoanTypeEnum.FULLY_AMORTIZED as PorfolioSecondaryFinancing.LoanTypeEnum
	amortization = 30
	description: string = ''
	enabled = false
	firstPaymentDate: Date = null

	constructor(config?: PorfolioSecondaryFinancing) {
		if (config) {
			this.initialAmount = config.initialAmount
			this.interestRate = config.interestRate
			this.term = Number(config.term)
			this.loanType = Number(config.loanType) as PorfolioSecondaryFinancing.LoanTypeEnum 
			this.amortization = Number(config.amortization)
			this.description = config.description
			this.enabled = config.enabled,
			this.firstPaymentDate = config.firstPaymentDate
		}
	}

	init(secondaryFinance) {
		if (secondaryFinance) {
			this.interestRate     = secondaryFinance.interestRate * 100
			this.initialAmount    = secondaryFinance.initialAmount
			this.term             = secondaryFinance.term || 5
			this.loanType         = (secondaryFinance.loanType || LoanTypeEnum.FULLY_AMORTIZED) as PorfolioSecondaryFinancing.LoanTypeEnum
			this.amortization     = secondaryFinance.amortization || 30
			this.description      = secondaryFinance.description
			this.enabled          = secondaryFinance.enabled
			this.firstPaymentDate = secondaryFinance.firstPaymentDate
		}
	}

	getData(): PorfolioSecondaryFinancing[] {
		return this.enabled ? [
			{	enabled: this.enabled,
				initialAmount: this.initialAmount,
				interestRate: this.interestRate,
				term: Number(this.term),
				loanType: Number(this.loanType) as PorfolioSecondaryFinancing.LoanTypeEnum,
				amortization: Number(this.amortization),
				description: this.description,
				firstPaymentDate: this.firstPaymentDate
			}
		] : []
	}
}

export class ExpensesConfig {
	currency: Currency = Currency.CAD
	municipalTax: number = null
	schoolTax: number = null
	insurance: number = null
	totalUtilities: number = null
	year = new Date().getFullYear()
	totalTaxes = null
	constructor(config?: ExpensesConfig) {
		if (config) {
			this.insurance = config.insurance
			this.municipalTax = config.municipalTax
			this.totalUtilities = config.totalUtilities
			this.schoolTax = config.schoolTax
			this.currency = config.currency
			this.year = config.year
			this.totalTaxes = config.totalTaxes
		}
	}

	init(expenses: Expenses) {
		this.currency = expenses && expenses.currency ? expenses.currency : this.currency
		this.insurance =  expenses && expenses.insurance ? expenses.insurance : null
		this.municipalTax =  expenses && expenses.municipalTax ? expenses.municipalTax : null
		this.totalUtilities =  expenses && expenses.totalUtilities ? expenses.totalUtilities : null
		this.schoolTax =  expenses && expenses.schoolTax ? expenses.schoolTax : null
		this.totalTaxes = expenses ? expenses.schoolTax + expenses.municipalTax : null
		this.year = expenses ?  expenses.year : this.year
	}

	getData(): Expenses {
		return {
			insurance: this.insurance,
			currency: this.currency,
			municipalTax: this.municipalTax,
			totalUtilities: this.totalUtilities,
			schoolTax: this.schoolTax,
			totalTaxes: this.totalTaxes,
			year: this.year
		}
	}
}

class AddressConfig {
	civicNumber = ''
	civicNumber2 = ''
	street = ''
	city = ''
	state = ''
	postalCode = ''
	coordinates = ''
	stateCode = ''

	constructor(config?: AddressConfig) {
		if (config) {
			this.civicNumber = config.civicNumber
			this.street = config.street
			this.city = config.city
			this.state = config.state
			this.postalCode = config.postalCode
			this.stateCode = config.stateCode
		}
	}

	init(obj) {
		this.civicNumber = obj && obj.civicNumber || ''
		this.civicNumber2 = obj && obj.civicNumber2 || ''
		this.street = obj && obj.street || ''
		this.city = obj && obj.city || ''
		this.state = obj && obj.state || ''
		this.postalCode = obj && obj.postalCode || ''
		this.stateCode = obj && obj.stateCode || ''
	}

	getData(): Address {
		return Object.assign({}, this)
	}

}