import { ModelPropertyShort, Address } from '@app/api_generated'
import { PropertyDataSource } from '@app-models/property-data-source'

export class PropertySearchDataSource extends PropertyDataSource<ModelPropertyShort | string> {

	constructor() {
		super()
	}

	next(data: (ModelPropertyShort | undefined)[]) {
		const newData = [
			... this.data$.value,
			... (data || [])
		]

		this._total = newData.length
		if (data.length < this._pageSize) {
			this._allLoaded = true
			newData.push('NOT_IN_LIST')
		}
		this._lock = false
		this.data$.next(newData)
	}
}

