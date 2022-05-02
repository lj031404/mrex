import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Listing, ListingType } from '@app/api_generated';
import { _translate } from '@app/core/utils/translate.util';
import { formatNumber } from '@angular/common';
import { BanksParametersService } from '@app/shared/services/banks-parameters.service';
import { ListingDoc } from '@app/core/localDB/listings.service';

export interface ListingDb extends Listing {
	id: string,
	valuationMeter?: {
		high: number,
		low: number,
		median:number,
		value: number
	},
	rentMeter?: {
		high: number,
		low: number,
		median:number,
		value: number
	}
	views?: {
		historicalPerformance: any[],
		features: any[],
		units: any[],
		acquisitionCosts: any[],
		income: any[],
		expenses: any[],
		financing: any[],
		qualification: any[],
	}
}

@Injectable({
	providedIn: 'root'
})
export class MarketListingAdapter {

	features: any = []
	units: any = []
	acquisitionCosts: any = []
	income: any = []
	expenses: any = []
	financing: any = []
	qualification: any = []
	historicalPerformance: any = []

	constructor(
		private translate: TranslateService
	) {}

	adapt(listing: ListingDoc) {

		try {
			this.setFeatures(listing)
			this.setUnits(listing)
			this.setAcquisitionCosts(listing)
			this.setIncome(listing)
			this.setExpenses(listing)
			this.setFinancing(listing)
			this.setQualification(listing)
			this.setHistoricalPerformance(listing)
	
			const convertedData = {
				id: listing.id,
				address: listing.address,
				pictures: listing.pictures,
				metrics: listing.metrics,
				listingType: listing.listingType as ListingType,
				propertyId: listing.propertyId,

				// special structures for the views (to not overwrite the existing attributes such as expenses which are structured differenly)
				views: {
					historicalPerformance: this.historicalPerformance,
					features: this.features,
					units: this.units,
					acquisitionCosts: this.acquisitionCosts,
					income: this.income,
					expenses: this.expenses,
					financing: this.financing,
					qualification: this.qualification,
				}
			}
	
			return convertedData
		}
		catch (err) {
			console.error(err)
			return
		}
	}

	setFeatures(listing: ListingDoc) {
		if (listing.features) {
			this.features = listing.features.map(x => {
				if (x.value === null || x.value === '') {
					return {
						feature: this.translate.instant(`page.market.listing.feature.${x.feature}`),
						value: this.translate.instant('page.market.listing.value.NA')
					}
				}
				// feature is just a string not to be translated
				else if (['buildingArea', 'buildingDimension', 'lotDimension'].includes(x.feature)) {
					return {
						feature: this.translate.instant(`page.market.listing.feature.${x.feature}`),
						value: x.value
					}
				}
				// list of features
				else if (typeof (x.value) === 'string' && x.value.split(',').length > 1) {
					return {
						feature: this.translate.instant(`page.market.listing.feature.${x.feature}`),
						value: x.value.split(',').map(feature => this.translate.instant(`page.market.listing.value.${feature}`)).join(', ')
					}
				}
				// feature is a number
				else if (typeof (x.value) === 'number') {
					return {
						feature: this.translate.instant(`page.market.listing.feature.${x.feature}`),
						value: x.value
					}
				}				
				// feature is a string
				else if (typeof (x.value) === 'string') {
					return {
						feature: this.translate.instant(`page.market.listing.feature.${x.feature}`),
						value: this.translate.instant(`page.market.listing.value.${x.value}`)
					}
				}
			})
		} else {
			this.features = []
		}
		
	}

	setUnits(listing: ListingDoc) {
		const NA = '-'
		if (listing.residentialDistribution) {
			this.units = [
				{
					unit: _translate(this.translate.instant('page.market.listing.units.1')),
					value: listing.residentialDistribution && listing.residentialDistribution[1] || NA
				},
				{
					unit: _translate(this.translate.instant('page.market.listing.units.2')),
					value: listing.residentialDistribution && listing.residentialDistribution[2] || NA
				},
				{
					unit: _translate(this.translate.instant('page.market.listing.units.3')),
					value: listing.residentialDistribution && listing.residentialDistribution[3] || NA
				},
				{
					unit: _translate(this.translate.instant('page.market.listing.units.4')),
					value: listing.residentialDistribution && listing.residentialDistribution[4] || NA
				},
				{
					unit: _translate(this.translate.instant('page.market.listing.units.5')),
					value: listing.residentialDistribution && listing.residentialDistribution[5] || NA
				},
				{
					unit: _translate(this.translate.instant('page.market.listing.units.6')),
					value: listing.residentialDistribution && listing.residentialDistribution[6] || NA
				},
				{
					unit: _translate(this.translate.instant('page.market.listing.units.total')),
					value: listing.residentialUnits,
					total: true
				}
			]
		}
		else {
			console.warn(`Cannot set units distribution for listing ${listing.id}`)
			this.units = []
		}
	}

	setAcquisitionCosts(listing: ListingDoc) {
		if (listing.acquisitionCosts) {
			this.acquisitionCosts = [
				{
					label: _translate(this.translate.instant('market_listing.acquisitionCosts.cashdown')),
					share: listing.acquisitionCosts.cashdown.share,
					value: listing.acquisitionCosts.cashdown.value,
					isEstimated: listing.acquisitionCosts.cashdown.isEstimated
				},
				{
					label: _translate(this.translate.instant('market_listing.acquisitionCosts.mortgage')),
					share: listing.acquisitionCosts.mortgage.share,
					value: listing.acquisitionCosts.mortgage.value,
					isEstimated: listing.acquisitionCosts.mortgage.isEstimated
				},
				{
					label: _translate(this.translate.instant('market_listing.acquisitionCosts.acquisitionFees')),
					share: listing.acquisitionCosts.acquisitionFees.share,
					value: listing.acquisitionCosts.acquisitionFees.value,
					isEstimated: listing.acquisitionCosts.acquisitionFees.isEstimated
				},
				{
					label: _translate(this.translate.instant('market_listing.acquisitionCosts.salePrice')),
					share: null,
					value: listing.acquisitionCosts.salePrice.value,
					isEstimated: listing.acquisitionCosts.salePrice.isEstimated
				},
				{
					label: _translate(this.translate.instant('market_listing.acquisitionCosts.acquisitionCost')),
					share: null,
					value: listing.acquisitionCosts.acquisitionCost.value,
					isEstimated: listing.acquisitionCosts.acquisitionCost.isEstimated
				}
			]
		}

		else {
			console.warn(`Cannot set acquisition costs for listing ${listing.id}`)
			this.acquisitionCosts = []
		}
	}

	setIncome(listing: ListingDoc) {
		if (listing.income) {
			this.income = [
				{
					label: _translate(this.translate.instant('market_listing.income.grossIncome')),
					share: listing.income.grossIncome.share,
					value: listing.income.grossIncome.value,
					isEstimated: listing.income.grossIncome.isEstimated
				},
				{
					label: _translate(this.translate.instant('market_listing.income.vacancy')),
					share: listing.income.vacancy.share,
					value: -listing.income.vacancy.value,
					isEstimated: listing.income.vacancy.isEstimated
				},
				{
					label: _translate(this.translate.instant('market_listing.income.effectiveIncome')),
					share: listing.income.effectiveIncome.share,
					value: listing.income.effectiveIncome.value,
					isEstimated: listing.income.effectiveIncome.isEstimated,
					computed: true
				},
				{
					label: _translate(this.translate.instant('market_listing.income.operatingExpenses')),
					share: listing.income.operatingExpenses.share,
					value: -listing.income.operatingExpenses.value,
					isEstimated: listing.income.operatingExpenses.isEstimated
				},
				{
					label: _translate(this.translate.instant('market_listing.income.normalizedNetIncome')),
					share: listing.income.netOperatingIncome.share,
					value: listing.income.netOperatingIncome.value,
					isEstimated: listing.income.netOperatingIncome.isEstimated,
					computed: true,
					total: true
				}
			]
		}

		else {
			console.warn(`Cannot set income for listing ${listing.id}`)
			this.income = []
		}
	}

	setExpenses(listing: ListingDoc) {
		if (listing.normalizedExpenses) {
			this.expenses = [
				{
					label: _translate(this.translate.instant('page.market.listing.expenses.taxes')),
					share: listing.normalizedExpenses.taxes.share,
					value: listing.normalizedExpenses.taxes.value,
					isEstimated: listing.normalizedExpenses.taxes.isEstimated
				},
				{
					label: _translate(this.translate.instant('page.market.listing.expenses.insurance')),
					share: listing.normalizedExpenses.insurance.share,
					value: listing.normalizedExpenses.insurance.value,
					isEstimated: listing.normalizedExpenses.insurance.isEstimated
				},
				{
					label: _translate(this.translate.instant('page.market.listing.expenses.utilities')),
					share: listing.normalizedExpenses.utilities.share,
					value: listing.normalizedExpenses.utilities.value,
					isEstimated: listing.normalizedExpenses.utilities.isEstimated
				},
				{
					label: _translate(this.translate.instant('page.market.listing.expenses.management')),
					share: listing.normalizedExpenses.management.share,
					value: listing.normalizedExpenses.management.value,
					isEstimated: listing.normalizedExpenses.management.isEstimated
				},
				{
					label: _translate(this.translate.instant('page.market.listing.expenses.maintenance')),
					share: listing.normalizedExpenses.maintenance.share,
					value: listing.normalizedExpenses.maintenance.value,
					isEstimated: listing.normalizedExpenses.management.isEstimated
				},
				{
					label: _translate(this.translate.instant('page.market.listing.expenses.salaries')),
					share: listing.normalizedExpenses.salaries.share,
					value: listing.normalizedExpenses.salaries.value,
					isEstimated: listing.normalizedExpenses.salaries.isEstimated
				},
				{
					label: _translate(this.translate.instant('page.market.listing.expenses.normalizedExpenses')),
					share: listing.normalizedExpenses.normalizedExpenses.share,
					value: listing.normalizedExpenses.normalizedExpenses.value,
					isEstimated: listing.normalizedExpenses.normalizedExpenses.isEstimated,
					computed: true,
					total: true
				}
			]
		}

		else {
			console.warn(`Cannot set normalized expenses for listing ${listing.id}`)
			this.expenses = []
		}
	}

	setFinancing(listing: ListingDoc) {
		if (listing.financing) {
			const banks = listing.financing.estimatedEconomicValue.map(x => x.financingCompany)

			const calcValues = (items, banks) => {
				const values = {}
				const maxValue = Math.max(...items.map(x => x.amount))
				banks.forEach(bank => {
					const amount = items.find(x => x.financingCompany === bank).amount
					let diff = amount / maxValue
					if (diff !== 1) {
						const alpha = 1.5 // amplify the diff
						diff /= alpha
					}
					// stretch from 0.25 - 1 range
					const rangeFrom = 0.25
					const stretched = (1 - rangeFrom) * diff + rangeFrom
					const color = BanksParametersService.getColorForBank(bank)
					values[bank] = [ amount, stretched, color ]
				})
				return values
			}
	
			this.financing = [
				{
					label: _translate(this.translate.instant('market_listing.financing.estimatedEconomicValue')),
					values: calcValues(listing.financing.estimatedEconomicValue, banks)
				},
				{
					label: _translate(this.translate.instant('market_listing.financing.maximumMortgage')),
					values: calcValues(listing.financing.maximumMortgage, banks)
				},
				{
					label: _translate(this.translate.instant('market_listing.financing.cashdown')),
					values: calcValues(listing.financing.cashdown, banks)
				},
				{
					label: _translate(this.translate.instant('market_listing.financing.requiredFinancing')),
					values: calcValues(listing.financing.requiredFinancing, banks)
				},
				{
					label: _translate(this.translate.instant('market_listing.financing.monthlyPayment')),
					values: calcValues(listing.financing.monthlyPayment, banks)
				}
			]
		}
		else {
			console.warn(`Cannot set financing for listing ${listing.id}`)
			this.financing = []
		}
	}

	private setQualification(listing: ListingDoc) {

		if (listing.qualification) {
			this.qualification = listing.qualification.map(q => {
				return {
					bank: q.financingCompany,
					data: [
						{
							label: _translate(this.translate.instant('market_listing.qualification.amortization')),
							value: String(q.amortization) + ' ' + this.translate.instant('literals.years')
						},
						{
							label: _translate(this.translate.instant('market_listing.qualification.vacancyRate')),
							value: formatNumber(q.vacancyRate, 'en-US', '1.1-1') + ' %'
						},
						{
							label: _translate(this.translate.instant('market_listing.qualification.rpv')),
							value:  formatNumber(q.ltv, 'en-US', '1.1-1') + ' %'
						},
						{
							label: _translate(this.translate.instant('market_listing.qualification.debtCoverageRatio')),
							value: formatNumber(q.debtCoverageRatio, 'en-US', '1.1-2')
						},
						{
							label: _translate(this.translate.instant('market_listing.qualification.interestRate')),
							value: formatNumber(q.interestRate, 'en-US', '1.2-2') + ' %'
						}
					]
				}
			})
		}
		else {
			console.warn(`Cannot set qualiification for listing ${listing.id}`)
			this.qualification = []
		}
	}

	private setHistoricalPerformance(listing: ListingDoc) {
		if (listing.historicalPerformance) {
			const data = (listing.historicalPerformance || []).map((hp: any) => ({
				year: hp.year,
				amount: hp.price,
				annualYield: hp.annualYield,
				increase: hp.annualYield >= 0 ? hp.annualYield : undefined,
				decrease: hp.annualYield < 0 ? hp.annualYield : undefined
			}))
			this.historicalPerformance = data
		}
		else {
			console.warn(`Cannot set historical performance for listing ${listing.id}`)
			this.historicalPerformance =[]
		}
	}
}
