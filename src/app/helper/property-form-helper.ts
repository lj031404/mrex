import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';

import { PropertyItemizeControlConfig, PropertyItemizeGroupConfig } from '@app/helper/configs/property-itemize-config';

@Injectable({
	providedIn: 'root'
})
export class PropertyFormHelper {

	static randHex(length: number) {
		let result = ''
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		const charactersLength = characters.length

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	static genId() {
		return 'id_' + PropertyFormHelper.randHex(10)
	}

	static sumOfItems(items: PropertyItemizeControlConfig[]) {
		// if all values are null, return null
		if (items.filter(x => x.amount !== null).length) {
			return items.reduce((total, item) => total + item.amount || 0, 0)
		}
		else { return null }
	}

	static sumOfMonthlyItems(items: PropertyItemizeControlConfig[]) {
		return 12 * items.reduce((total, item) => total + item.amount || 0, 0)
	}

	constructor(private fb: FormBuilder) {}


	createNestedItemListWithTotal(config: PropertyItemizeGroupConfig, sumValidators, itemsValidators?: any) {
		const formGroup = this.createNestedItemList(config, itemsValidators)
		formGroup.addControl('total', new FormControl(config.total, sumValidators))
		return formGroup
	}

	createNestedItemList(config: PropertyItemizeGroupConfig, validators?: any) {
		const formGroup = this.fb.group({
			items: this.fb.array([])
		})

		if (config && config.items && config.items.length) {
			config.items.forEach((item, index) => {
				const obj = {}
				Object.keys(item).forEach(k => {
					if (k === 'amount') {
						obj[k] = [ item[k], validators ]
					}
					else {
						if (Array.isArray(item[k])) {
							obj[k] = this.fb.array(item[k])
						}
						else {
							obj[k] = item[k]
						}
					}
				});
				(formGroup.controls.items as FormArray).insert(index, this.fb.group( { ...obj }))
			})
		}
		return formGroup
	}

	createItemList(config: PropertyItemizeControlConfig[], validators?: any) {
		const formArray = this.fb.array([])

		if (config && config.length) {
			config.forEach((item, index) => {
				const obj = {}
				Object.keys(item).forEach(k => obj[k] = [ item[k], validators ]);
				formArray.insert(index, this.fb.group({ ... obj }))
			})
		}

		return formArray
	}
}
