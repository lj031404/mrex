import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, takeWhile } from 'rxjs/operators';

import { PropertyType } from '@app-models/property.interface'
import { PropertyInfoConfig } from '@app/helper/configs/property-info-config';
import { PropertyItemizeControlConfig } from '@app/helper/configs/property-itemize-config'
import { PropertyFormHelper } from '@app/helper/property-form-helper';
import { TranslateService } from '@ngx-translate/core';
import { _translate } from '@app/core/utils/translate.util';
import { merge } from 'rxjs';

@Component({
	selector: 'app-property-info',
	templateUrl: './property-info.component.html',
	styleUrls: ['./property-info.component.scss']
})
export class PropertyInfoComponent implements OnInit {
	PropertyType = PropertyType
	propertyOptionKeys = Object.keys(PropertyType)

	@Input() propertyAddForm: FormGroup
	@Input() propertyInfoConfig: PropertyInfoConfig
	@Input() isBaseModel: boolean

	form: FormGroup

	itemizeUnitsCheck = false
	itemizeUnitsArray: FormArray

	_residentialUnits: any = null

	constructor(
		private fb: FormBuilder,
		private translate: TranslateService,
		private formHelper: PropertyFormHelper
	) { }

	ngOnInit() {
		this.form = this.fb.group({
			id: this.propertyInfoConfig.id,
			inheritedFrom: this.propertyInfoConfig.inheritedFrom,
			parent: this.propertyInfoConfig.parent,
			name: [this.propertyInfoConfig.name, Validators.required],
			address: this.fb.group({
				civicNumber: [this.propertyInfoConfig.address.civicNumber, Validators.required],
				civicNumber2: [this.propertyInfoConfig.address.civicNumber2],
				street: [this.propertyInfoConfig.address.street, Validators.required],
				city: [this.propertyInfoConfig.address.city, Validators.required],
				state: [this.propertyInfoConfig.address.state, Validators.required],
				postalCode: [this.propertyInfoConfig.address.postalCode, [Validators.required, Validators.minLength(3)]]
			}),
			type: [this.propertyInfoConfig.type, Validators.required],
			yearOfConstruction: this.propertyInfoConfig.yearOfConstruction,
			floors: [this.propertyInfoConfig.floors, [Validators.max(50)]],
			footageWidth: this.propertyInfoConfig.footageWidth,
			footageHeight: this.propertyInfoConfig.footageHeight,
			residentialUnits: [{ value: this.propertyInfoConfig.residentialUnits, disabled: this.itemizeUnitsCheck ? true : false }, [Validators.required, Validators.min(1), Validators.max(100)]],
			residentialDistribution: this.formHelper.createNestedItemList(this.propertyInfoConfig.residentialDistribution),
			buildingArea: this.propertyInfoConfig.buildingArea,
			lotArea: this.propertyInfoConfig.lotArea
		})

		if (this.propertyAddForm) {
			this.propertyAddForm.addControl(
				'property',
				this.form
			)
		}

		// default name
		if (!this.form.get('name').value) {
			const defaultName = _translate(this.translate.instant('helper.property-add.components.property-info.defaultName'))
			const address = this.propertyInfoConfig.address
			const addressStr = `${address.civicNumber || ''}${address.civicNumber2 ? '-' + address.civicNumber2 || '' : '' } ${address.street || ''}`
			this.form.get('name').setValue(addressStr.length > 2 ? addressStr  : defaultName)
		}

		this.itemizeUnitsArray = (this.form.controls.residentialDistribution as FormGroup).controls.items as FormArray

		this.processNumberOfUnits()
		this.setupResidentialUnitRelation()
		this.setBuildingArea()
	}

	setBuildingArea() {
		merge(
			this.propertyAddForm.get('property.footageHeight').valueChanges,
			this.propertyAddForm.get('property.footageWidth').valueChanges,
		).pipe(takeWhile(() => Boolean(this.form))).subscribe(res => {
			const buildingArea = this.propertyAddForm.get('property.buildingArea')
			const height = this.propertyAddForm.get('property.footageHeight').value
			const width = this.propertyAddForm.get('property.footageWidth').value
			buildingArea.setValue(height * width)
		})
	}

	onActive() {

	}

	onItemizeUnitsCheck(event: any) {
		this.itemizeUnitsCheck = event.target.checked
	}

	setupResidentialUnitRelation() {
		this.form.controls.residentialUnits.valueChanges
			.pipe(
				debounceTime(700),
				filter(value => value <= 100),
				takeWhile(() => Boolean(this.form))
			)
			.subscribe(units => {
				if (units !== this._residentialUnits) {
					this._residentialUnits = units
					this.processNumberOfUnits()
				}
			})

		this.itemizeUnitsArray.valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((distribution: PropertyItemizeControlConfig[]) => {
				this._residentialUnits = distribution.reduce((total, unit) => total + unit.amount, 0)
				this.form.get('residentialUnits').setValue(this._residentialUnits, { emitEvent: false })
			})
	}

	processNumberOfUnits() {
		const items: PropertyItemizeControlConfig[] = this.itemizeUnitsArray.value
		if (items.find(x => x.amount)) {
			this.onItemizeUnitsCheck({ target: { checked: true }})
		}
		this.itemizeUnitsArray.setValue(items, { emitEvent: false })
	}

}
