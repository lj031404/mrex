import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PortfolioSummary } from '@app-models/summary.interface';
import { PropertyIndicators } from '@app-models/property.interface';
import { Indicator } from '@app-models/common';
import { Constants } from '@app/core/utils/constants.util';

@Component({
	selector: 'app-summary-card',
	templateUrl: './summary-card.component.html',
	styleUrls: ['./summary-card.component.scss']
})
export class SummaryCardComponent implements OnInit, OnChanges {
	@Input() summary: PortfolioSummary;

	indicators: {
		label: string;
		indicator: Indicator | string;
	}[] = [];

	constructor() { }

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		const summary = changes['summary'];
		if (summary && summary.currentValue !== summary.previousValue) {
			const { indicators } = summary.currentValue;
			this.indicators = Object.keys(indicators).map(key => ({
				label: Constants.Property.Label[key],
				indicator: indicators[key]
			}));
		}
	}
}
