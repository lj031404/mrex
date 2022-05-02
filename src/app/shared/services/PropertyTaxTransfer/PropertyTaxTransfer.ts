import { ISOCODES, PropertyTransferTaxQuebec } from './PropertyTaxTransfer_Quebec';


export class PropertyTransferTax {
	city = ''
	isoCode = ''

	constructor(isoCode: string = '', city: string = '') {
		if (!isoCode) {
			throw new Error('undefined isCode!')
		}
		if (!isoCode) {
			throw new Error('undefined city!')
		}
		this.isoCode = isoCode
		this.city = city
	}

	calc(amount: number) {
		switch (this.isoCode) {
			case ISOCODES.CA.QC.ISOCODE:
				const tax = new PropertyTransferTaxQuebec(this.city)
				return tax.calc(amount)
			default:
				return 0
				break
		}
	}
}

