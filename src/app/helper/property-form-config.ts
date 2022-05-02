import { Hypothesis } from '@app/api_generated';

import { PropertyInfoConfig } from '@app/helper/configs/property-info-config';
import { PurchaseInfoConfig } from '@app/helper/configs/purchase-info-config';
import { CashFlowInfoConfig } from '@app/helper/configs/cash-flow-info-config';
import { Property } from '@app/core/models/property.interface';
import { HypothesisInputLocal } from '@app/core/models/hypothesis.interface';

export class PropertyFormConfig {
	property: PropertyInfoConfig
	purchase: PurchaseInfoConfig
	cashflow: CashFlowInfoConfig

	constructor(formConfigData?: PropertyFormConfig) {
		this.property = new PropertyInfoConfig(formConfigData && formConfigData.property)
		this.purchase = new PurchaseInfoConfig(formConfigData && formConfigData.purchase)
		this.cashflow = new CashFlowInfoConfig(formConfigData && formConfigData.cashflow)
	}

	init(property: Property, hypothesis?: Hypothesis) {
		if (!property) {
			property = {} as Property
		}
		if (!hypothesis) {
			hypothesis = {} as Hypothesis
		}

		this.property.init(property, hypothesis)
		this.purchase.init(property, hypothesis)
		this.cashflow.init(property, hypothesis)
	}

	getData(): { property: Property, hypothesis: HypothesisInputLocal } {
		const propertyInfoData = this.property.getData()
		const purchaseInfoData = this.purchase.getData(this.property.residentialUnits)
		const cashFlowInfoData = this.cashflow.getData(this.property.residentialUnits)

		// console.log(propertyInfoData)
		// console.log(purchaseInfoData)
		// console.log(cashFlowInfoData)

		const property: Property = this.assignDefined({}, propertyInfoData.property, purchaseInfoData.property, cashFlowInfoData.property)
		const hypothesis: HypothesisInputLocal = this.assignDefined({}, propertyInfoData.hypothesis, purchaseInfoData.hypothesis, cashFlowInfoData.hypothesis)

		// Array of terms (1 financing + 1 refinancing)
		// TODO: what if the user enters a 2 years financing and a refinancing at year 4 ? That would be a bug. It should be consecutive
		const interestRate1stRank        = this.purchase.economicValues.find(x => x.financingCompany === this.purchase.financingType).interestRate
		const interestRate1stRefinancing = this.cashflow.refinancingEconomicValues.find(x => x.financingCompany === this.cashflow.refinancingParameters.refinancingType).interestRate
		const termsInterestRates = [
			interestRate1stRank,            // 1st rank interest rate
			interestRate1stRefinancing      // refinancing interest rate
		]

		hypothesis.termsInterestRates = termsInterestRates

		return {
			property,
			hypothesis
		}
	}

	// ignore undefined values in order to not overwrite defined values by undefined values
	private assignDefined(target, ...sources) {
		for (const source of sources) {
			for (const key of Object.keys(source)) {
				const val = source[key];
				if (val !== undefined) {
					target[key] = val;
				}
			}
		}
		return target;
	}
}

