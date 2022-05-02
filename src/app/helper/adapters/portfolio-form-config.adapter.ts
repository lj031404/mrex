import { Injectable } from '@angular/core'

import { PortfolioFormConfig } from '@app/helper/portfolio-form-config'
import { Portfolio } from '@app/core/models/portfolio.interface';
import { PortfolioPropertyCreate } from '@app/api_generated';
@Injectable({
	providedIn: 'root'
})
export class PortfolioFormConfigAdapter {
	adapt(portfolioProperty: Portfolio): PortfolioFormConfig {
		const config = new PortfolioFormConfig()
		config.init(portfolioProperty)
		return config
	}

	getData(configData: PortfolioFormConfig): Portfolio {
		return new PortfolioFormConfig(configData).getData()
	}
}
