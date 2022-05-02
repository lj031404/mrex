import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Indicator } from '@app-models/common';

@Pipe({
	name: 'indicatorHtmlContent'
})
export class IndicatorHtmlContentPipe implements PipeTransform {

	transform(indicator: Indicator, args?: any): any {
		if (typeof indicator === 'string') {
			return indicator;
		}

		const decimalTransform = new DecimalPipe('en');
		const valueString = indicator.value ?
			(decimalTransform.transform(indicator.value, '1.0-0') + ' ' + (indicator.unit || '')) : '';
		const trendValueString = indicator.trendValue ?
			(
				indicator.trendValue > 0 ?
					'+' + indicator.trendValue :
					indicator.trendValue
			) + (indicator.trendUnit || '')
			: '';

		const content =
			valueString +
			(
				valueString && trendValueString ?
					('<span> (' + trendValueString + ')</span>') :
					('<span>' + trendValueString + '</span>')
			);

		return content;
	}

}
