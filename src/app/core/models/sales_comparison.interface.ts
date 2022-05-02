export interface SalesComparison {
	potentialPrice: number
	address: Address
	header: KPI[]
	comparables: Comparable[]
 }

export interface KPI {
	label: string
	value: number
	amount: number
}

export interface Comparable {
	price: number
	address: Address
	distance: number
	kpi: KPI[]
	eventType: string
	eventDate: Date
	imageUrl: string,
	isChecked: boolean,
	id: string
}

interface Address {
	country: string
	state: string
	city: string
	district: string
	street: string
}