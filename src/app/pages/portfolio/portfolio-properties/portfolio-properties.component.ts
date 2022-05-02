import { Component, OnInit } from '@angular/core';

import { UnitType } from '@app-models/unit.enum';
import { PortfolioProperty } from '@app-models/property.interface';

@Component({
	selector: 'app-portfolio-properties',
	templateUrl: './portfolio-properties.component.html',
	styleUrls: ['./portfolio-properties.component.scss']
})
export class PortfolioPropertiesComponent implements OnInit {

	properties: PortfolioProperty[] = [
		{
			address: '1437 Peel Avenue',
			units: 48,
			pictureUrls: ['assets/39.png'],
			marketValue: {
				value: 1500000,
				unit: UnitType.USD,
				trendValue: 6.33,
				trendUnit: UnitType.Percentage
			},
			economicValue: {
				value: 900000,
				unit: UnitType.USD
			},
			totalAppreciation: {
				value: 48754,
				unit: UnitType.USD
			},
			annualizedAppreciation: {
				trendValue: 5.9,
				trendUnit: UnitType.Percentage
			},
			leverage: {
				value: 236451,
				unit: UnitType.USD
			},
			LTV: {
				value: 32.3,
				unit: UnitType.Percentage
			},
			equity: {
				value: 345555,
				unit: UnitType.USD
			},
			dsr: {
				value: 1.3
			},
			refinancingSituation: {
				trendValue: 100000,
				trendUnit: UnitType.USD
			},
			mortgageMaturity: 'July 24th 2022'
		}
	];

	constructor() { }

	ngOnInit() {
	}

}
