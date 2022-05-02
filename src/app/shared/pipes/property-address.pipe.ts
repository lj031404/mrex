import { Pipe, PipeTransform } from '@angular/core'

import { Address } from '@app/api_generated'

@Pipe({
	name: 'propertyAddress'
})
export class PropertyAddressPipe implements PipeTransform {

	constructor() {}

	transform(address: Address, args?: string): any {
		const segments = []

		if (!args || args === 'first') {
			let civicNumber = ''
			if (address && address.civicNumber) {
				civicNumber = address.civicNumber
			}
			if (address && address.civicNumber2) {
				if (address.civicNumber) {
					civicNumber += '-'
				}
				civicNumber += address.civicNumber2
			}
			if (civicNumber) {
				segments.push(civicNumber)
			}

			if (address && address.street) {
				segments.push(address.street)
			}
		} else if (args === 'second') {
			if (address && address.city) {
				segments.push(address.city)
			}
			if (address && address.state) {
				segments.push(`(${address.state})`)
			}
			if (address && address.postalCode) {
				segments.push(address.postalCode.substr(0, 3) + ' ' + address.postalCode.substr(3, 3))
			}
		} else if (args === 'districtCity') {
			if (address && address.district) {
				segments.push(address.district)
			}
			if (address && address.city) {
				segments.push(address.city)
			}
			if (address && address.state) {
				segments.push(`(${address.state})`)
			}
			if (address && address.postalCode) {
				segments.push(address.postalCode.substr(0, 3) + ' ' + address.postalCode.substr(3, 3))
			}
		}

		return segments.join(' ')
	}

}
