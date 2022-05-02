import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'paymentCardNumber'
})
export class PaymentCardNumberPipe implements PipeTransform {

	transform(value: string, ...args: any[]): any {
		if (value) {
			let result = ''
			for (let i = 0; i < value.length; i++) {
				result += '*'
			}
			result = result + ' ' + value
			return result
		}
		return ''
	}

}
