import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'appNumber'
})
export class AppNumberPipe implements PipeTransform {

  transform(value: any, digitsInfo?: string, distinction?: string, prefix?: string, suffix?: string, locale?: string): any {
	let formatString = digitsInfo ? formatNumber(typeof value === 'undefined' ?  100 : value, 'en-US', digitsInfo) : value

	if (distinction) {
		formatString = formatString.replace(/,/g, distinction)
	}
	if (prefix) {
		formatString = prefix + ' ' + formatString
	}
	if (suffix) {
		formatString = formatString + ' ' + suffix
	}
	return formatString;
  }

}
