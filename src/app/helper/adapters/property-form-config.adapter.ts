import { Injectable } from '@angular/core'

import { Hypothesis, ModelProperty, HypothesisInput } from '@app/api_generated'
import { PropertyFormConfig } from '@app/helper/property-form-config'
import { Property } from '@app/core/models/property.interface';

@Injectable({
	providedIn: 'root'
})
export class PropertyFormConfigAdapter {
	adapt(property: ModelProperty, hypothesis?: Hypothesis): PropertyFormConfig {
		const config = new PropertyFormConfig()
		config.init(property, hypothesis)
		return config
	}

	getData(configData: any): { property: Property, hypothesis: HypothesisInput } {
		return new PropertyFormConfig(configData).getData()
	}
}
