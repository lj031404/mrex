import { Address, Hypothesis, ModelProperty, ResidentialDistribution, HypothesisInput, CoordinatePoint } from '@app/api_generated';
import { PropertyItemizeControlConfig, PropertyItemizeGroupConfig } from '@app/helper/configs/property-itemize-config';
import { Property, PropertyType } from '@app/core/models/property.interface';
import { HypothesisLocal, HypothesisInputLocal } from '@app/core/models/hypothesis.interface';

export class PropertyInfoConfig {
	id = null
	inheritedFrom = null
	hypothesisId = null
	name = ''
	address: Address
	type = ''
	yearOfConstruction: number = null
	floors: number = null
	footageWidth: number = null
	footageHeight: number = null
	parent: string = null
	residentialUnits: number = null
	residentialDistribution: ResidentialDistributionConfig
	lotArea: number = null
	buildingArea: number = null

	constructor(propertyInfoConfig?: PropertyInfoConfig) {
		if (propertyInfoConfig) {
			this.id = propertyInfoConfig.id,
			this.inheritedFrom = propertyInfoConfig.inheritedFrom,
			this.hypothesisId = propertyInfoConfig.hypothesisId
			this.name = propertyInfoConfig.name
			this.address = propertyInfoConfig.address
			this.type = propertyInfoConfig.type
			this.yearOfConstruction = propertyInfoConfig.yearOfConstruction
			this.floors = propertyInfoConfig.floors
			this.footageWidth = propertyInfoConfig.footageWidth
			this.footageHeight = propertyInfoConfig.footageHeight
			this.parent = propertyInfoConfig.parent
			this.residentialUnits = propertyInfoConfig.residentialUnits
			this.residentialDistribution = new ResidentialDistributionConfig(propertyInfoConfig.residentialDistribution)
			this.lotArea = propertyInfoConfig.lotArea
			this.buildingArea = propertyInfoConfig.buildingArea
		} else {
			this.address = {
				civicNumber: '',
				street: '',
				city: '',
				state: '',
				postalCode: '',
				coordinates: { coordinates: [] }
			}
			this.residentialDistribution = new ResidentialDistributionConfig()
		}
	}

	init(property: Property, hypothesis?: HypothesisLocal) {
		let dimensionSplit = []
		if (property.lotDimension) {
			dimensionSplit = property.lotDimension.split('x')
		}

		this.id = property.id
		this.inheritedFrom = property.inheritedFrom
		this.hypothesisId = hypothesis._id
		this.name = property.name || ''
		this.address = {
			civicNumber: property.address ? property.address.civicNumber : '',
			street: property.address ? property.address.street : '',
			city: property.address ? property.address.city : '',
			state: property.address ? property.address.state : '',
			postalCode: property.address ? property.address.postalCode : '',
			coordinates: property.address && property.address.coordinates ? property.address.coordinates : {}
		}
		if (property.address && property.address.civicNumber2) {
			this.address.civicNumber += '-' + property.address.civicNumber2
		}

		this.parent = property.parent || null
		this.type = property.propertyType || ''
		this.yearOfConstruction = property.yearOfConstruction || null
		this.floors = property.floors || null
		this.footageWidth = dimensionSplit[0] ? parseInt(dimensionSplit[0], 10) || null : null
		this.footageHeight = dimensionSplit[1] ? parseInt(dimensionSplit[1], 10) || null : null
		this.residentialUnits = property.residentialUnits || (property as any).dwellings || null // legacy support (dwellings)
		this.residentialDistribution.init(property.residentialDistribution)
		this.lotArea = property.lotArea
		this.buildingArea = property.buildingArea

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

	getData(): { property: Property, hypothesis: HypothesisInput } {
		const property: Property = {}
		let hypothesis = {} as HypothesisInputLocal

		const SQFT_TO_M2 = 0.092903
		const FT_TO_M = 0.3048

		const address = this.address

		try {
			[ address.civicNumber, address.civicNumber2 ] = address.civicNumber.split('-')
		}
		catch (err) {}

		property.id = this.id
		property.inheritedFrom = this.inheritedFrom
		property.name = this.name
		property.address = address
		property.propertyType = this.type as any
		property.yearOfConstruction = this.yearOfConstruction
		property.floors = this.floors
		property.parent = this.parent
		property.lotDimension = `${ this.footageWidth || 0 }x${ this.footageHeight || 0 }`
		property.residentialUnits = this.residentialUnits || 0
		property.residentialDistribution = this.residentialDistribution.getData()
		property.buildingArea = (this.footageWidth * this.footageHeight) * SQFT_TO_M2
		property.buildingDimension = FT_TO_M * this.footageWidth + 'x' + FT_TO_M * this.footageHeight
		property.lotArea = this.lotArea
		property.buildingArea = this.buildingArea

		hypothesis = {
			_id: this.hypothesisId,
			numberOfUnits: this.residentialUnits,

			// Optimization and refinance
			refinanceNumberOfUnits: this.residentialUnits // field to be added in the forms EVENTUALLY

		} as HypothesisInputLocal

		return { property, hypothesis }
	}
}

export class ResidentialDistributionConfig implements PropertyItemizeGroupConfig {
	items: PropertyItemizeControlConfig[]

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
