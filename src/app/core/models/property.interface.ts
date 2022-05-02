import { Indicator } from '@app-models/common';
import { ModelProperty, ListingType, Hypothesis, Picture } from '@app/api_generated';

export interface Property extends ModelProperty {
	image?: string;
	models?: string[];
}

export interface PropertyLocalData {
	propertyData: Property
	hypothesisData: Hypothesis
	localUpdateTime: number,

	// Loki stuff
	$loki?: number
	meta?: {
		revision: number
		created: number
		version: number
	}
}

export interface PropertyHeader {
	units?: number;
	pictures: Picture[];
	listingType?: ListingType;
	marketValue?: Indicator;
}

export interface PropertyIndicators {
	marketValue?: Indicator;
	economicValue?: Indicator;
	totalAppreciation?: Indicator;
	annualizedAppreciation?: Indicator;
	leverage?: Indicator;
	LTV?: Indicator;
	equity?: Indicator;
	dsr?: Indicator;
	refinancingSituation?: Indicator;
	mortgageMaturity?: string;
}

export interface PortfolioProperty extends PropertyIndicators {
	address: string;
	units?: number;
	pictureUrls: string[];
	propertyStatus?: string;
}

export interface PropertyInformation {
	title: string;
	civicNumber: string;
	civicNumber2?: string;
	street: string;
	city: string;
	province: string;
	zip: string;
	type: PropertyType;
	yearOfConstruction: string;
	floors: number;
	squareFootage: {
		w: number;
		h: number;
	},
	units: number;
	itemizeUnitsCheck: boolean;
	itemizeUnits: {
		name: string;
		label?: string;
		unit: number;
	}[];
}

// TODO: use the PropertyType from the Swagger interface instead!
// and use translation. 
export enum PropertyType {
	plex = 'literals.property_type.plex',
	multifamilyResidential = 'literals.property_type.multifamilyResidential',
	multifamilyMixedUse = 'literals.property_type.multifamilyMixedUse'
}

