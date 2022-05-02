import { PortfolioConfig } from '@app/helper/configs/portfolio.info-config';
import { Portfolio } from '@app/core/models/portfolio.interface';

export class PortfolioFormConfig {
	public property: PortfolioConfig

	constructor(formConfigData?: PortfolioFormConfig) {
		this.property = new PortfolioConfig(formConfigData && formConfigData.property)
	}

	init(property: Portfolio) {
		if (!property) {
			property = {} as Portfolio
		}

		this.property.init(property)

	}

	getData(): Portfolio {
		const propertyInfoData = this.property.getData()
		const portfolio: Portfolio = this.assignDefined({}, propertyInfoData.portfolio)

		portfolio.primaryFinancing.interestRate /= 100
		portfolio.secondaryFinancing.interestRate /= 100

		return portfolio
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

