import { Injectable } from '@angular/core';
import { FinancialsService, EconomicValues, FinancingCompany } from '@app/api_generated';

export interface Logo {
	name: string
	src: string
	color: string
}

@Injectable({
	providedIn: 'root'
})
export class BanksParametersService {

	static set financials(financials) {
		this._financials = financials
	}

	static get financials() {
		return this._financials
	}

	static get banksIds(): string[] {
		return this._financials.banks.map(x => x.id)
	}
	private static _financials: any

	public static logos: Logo[] = [
		{ name: 'CHMC', src: 'assets/images/banks/chmc.jpg', color: '#F28500' },
		{ name: 'Desjardins', src: 'assets/images/banks/desjardins.jpg', color: '#349E89' },
		{ name: 'BNC', src: 'assets/images/banks/bnc.svg', color: '#E41C23' },
		{ name: 'RBC', src: 'assets/images/banks/rbc.png', color: '#005DAA' },
		{ name: 'ConventionalCustom', src: 'assets/images/banks/custom.png', color: '#848284' }
	]

	static getColorForBank(bank: string) {
		const logo = this.logos.find(x => x.name === bank)
		return logo && logo.color
	}

	static getBankIndex(bank: string): number {
		let index = 0
		BanksParametersService.banksIds.forEach((x, i) => {
			x === bank ? index = i : 0
		})
		return index
	}

	static defaultParameters(residentialUnits: number): { [id: string]: EconomicValues } {
		// CHMC Rules
		let yearlySalariesPerUnit, managementRate, DCR
		if (residentialUnits <= 6) {
			yearlySalariesPerUnit = 125
			managementRate = 3
			DCR = 1.1
		}
		else if (residentialUnits >= 7 && residentialUnits <= 11) {
			yearlySalariesPerUnit = 175
			managementRate = 4
			DCR = 1.3
		}
		else if (residentialUnits >= 12) {
			yearlySalariesPerUnit = 300
			managementRate = 5
			DCR = 1.3
		}

		const defaultParams = {
			CHMC: {
				qualificationRate: null,
				interestRate: null,
				DCR,
				LTV: 85,
				amortization: 30,
				term: 5,
				yearlyMaintenancePerUnit: 500,
				yearlySalariesPerUnit,
				managementRate,
				vacancyRate: 5,
				financingCompany: FinancingCompany.CHMC
			},
			BNC: {
				qualificationRate: null,
				interestRate: null,
				DCR: 1.2,
				LTV: 75,
				amortization: 25,
				term: 5,
				yearlyMaintenancePerUnit: 500,
				yearlySalariesPerUnit: 125,
				managementRate: 3,
				vacancyRate: 5,
				financingCompany: FinancingCompany.BNC
			},
			Desjardins: {
				qualificationRate: null,
				interestRate: null,
				DCR: 1.15,
				LTV: 75,
				amortization: 25,
				term: 5,
				yearlyMaintenancePerUnit: 500,
				yearlySalariesPerUnit: 175,
				managementRate: 3,
				vacancyRate: 5,
				financingCompany: FinancingCompany.Desjardins
			},
			RBC: {
				qualificationRate: null,
				interestRate: null,
				DCR: 1.15,
				LTV: 75,
				amortization: 25,
				term: 5,
				yearlyMaintenancePerUnit: 500,
				yearlySalariesPerUnit: 175,
				managementRate: 4,
				vacancyRate: 5,
				financingCompany: FinancingCompany.RBC
			},
			ConventionalCustom: {
				qualificationRate: null,
				interestRate: null,
				DCR: 1.15,
				LTV: 75,
				amortization: 25,
				term: 5,
				yearlyMaintenancePerUnit: 500,
				yearlySalariesPerUnit: 175,
				managementRate: 4,
				vacancyRate: 5,
				financingCompany: FinancingCompany.ConventionalCustom
			}
		}

		// overwrite default params by some of the attributes returned by the API
		this.financials.banks
			.forEach(bank => {
				if (defaultParams[bank.id]) {
					try {
						defaultParams[bank.id].qualificationRate = bank.qualificationRate
						defaultParams[bank.id].interestRate      = bank.interestRate
					}
					catch (err) {
						console.error(err)
					}
				}
			})

		return defaultParams
	}

	static getBankParams(residentialUnits, bank) {
		return BanksParametersService.defaultParameters(residentialUnits)[bank]
	}

	static resetEconomicValues(residentialUnits) {
		return BanksParametersService.banksIds.map((bank, i) => {
			const params = BanksParametersService.getBankParams(residentialUnits, bank)
			params.qualificationRate *=  100
			params.interestRate *=  100
			return params
		})
	}

	constructor(private financialsService: FinancialsService) {
	}

	async sync(): Promise<void> {
		console.info('Synchroninzing banking data')
		BanksParametersService.financials = await this.financialsService.getFinancials().toPromise()
	}
}
