import { PaymentMethod } from '../../api_generated/model/paymentMethod'

export interface CreditCard {
	type: string
	number: string
	expMonth: string
	expYear: string
	cvc: string	
}

export interface Payment extends PaymentMethod {
	expDate?: Date
}

