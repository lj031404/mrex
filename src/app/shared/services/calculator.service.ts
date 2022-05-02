import { Injectable } from '@angular/core'
import { Property, PropertyLocalData } from '@app/core/models/property.interface'
import { PropertyFormConfig } from '@app/helper/property-form-config'
import { PropertyFormConfigAdapter } from '@app/helper/adapters/property-form-config.adapter'
import { PropertiesService } from '@app/core/localDB/properties.service'
import { TranslateService } from '@ngx-translate/core'
import { TimeDuration } from '../utils'
import { ListingDoc } from '@app/core/localDB/listings.service'

@Injectable({
	providedIn: 'root'
})
export class CalculatorService {

	constructor(
		private formConfigAdapter: PropertyFormConfigAdapter,
		private translate: TranslateService,
		private propertiesService: PropertiesService) { }

	async getMasterModel(propertyId: string): Promise<PropertyLocalData|null> {

		// get parent model(s) inherited from for this root property
		const models = this.propertiesService.getParentPropertiesInheritedFrom(propertyId)

		if (models.length === 0) {
			console.log(`0 master model found for root property ${propertyId}`)
			return
		}
		else if (models.length === 1) {
			console.log(`1 master model found for root property ${propertyId}`)
			return models[0]
		}
		else {
			console.error(`More than one master model for property ${propertyId}???. Using the last one created as the default model!`)
			return models.splice(-1)[0]
		}

	}

	async getConfigFromListing(listing: ListingDoc): Promise<PropertyFormConfig> {
		let config: PropertyFormConfig

		// as ListingDb is an extend of the modelProperty, clone it. But strictly speaking, we deal with a property here
		const property = { ...listing } as Property

		const masterModel = await this.getMasterModel(listing.propertyId)

		const models = this.propertiesService.listChildModels(masterModel && masterModel.propertyData.id).map(x => x.propertyData)

		console.log(`${models.length} child models found`)

		// A master model exist. So the model created will be a child  model of the master model
		if (masterModel) {
			config = this.formConfigAdapter.adapt(masterModel.propertyData)
			const modelCount = models.length + 1
			config.property.name = this.translate.instant('page.watchlist.property-model-list.newModel') + ` (${modelCount})`
			config.property.parent = config.property.id
			delete config.property.id
			delete config.property.hypothesisId
		}
		// No master model exist
		else {

			config = this.formConfigAdapter.adapt(property)
			console.log('[Properties List] Create Property Form Config', config)

			config.property.inheritedFrom = property.id
			delete config.property.id
		}

		return config
	}

}
