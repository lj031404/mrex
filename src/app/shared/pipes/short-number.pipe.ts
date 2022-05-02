import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

	transform(input: any, args?: any): any {
		let exp
		const suffixes = ['M', 'G', 'T', 'P', 'E']

		if (Number.isNaN(input)) {
			return null
		}

		if (!input) {
			return 0
		}

		if (input < 1000000) {
			return input.toFixed(args).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		}

		exp = Math.floor(Math.log(input) / Math.log(1000000))

		return (input / Math.pow(1000000, exp)).toFixed(args) + suffixes[exp - 1]

	}

}
