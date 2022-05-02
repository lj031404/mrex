export interface DropdownChoice {
	value: (number|string)
	label: string
}

export interface PropertyItemizeControlConfig {
	name: string
	label: string
	amount: number
	unit?: string
	placeholder?: string
	disabled?: boolean
	step?: number
	min?: number
	max?: number
	hide?: boolean
	required?: boolean
	decimals: number
	choices?: DropdownChoice[] // for drop down
}

export interface PropertyItemizeGroupConfig {
	total?: number
	items: PropertyItemizeControlConfig[]
}
