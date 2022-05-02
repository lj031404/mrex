import { PropertyIndicators } from '@app-models/property.interface';

export interface PortfolioSummary {
	buildings: number;
	units: number;
	showcase: string[];
	indicators: PropertyIndicators;
}
