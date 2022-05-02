import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { PropertyItemizeControlConfig, PropertyItemizeGroupConfig } from '@app/helper/configs/property-itemize-config';
import { PropertyFormHelper } from '@app/helper/property-form-helper';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
import { PlansService } from '@app/shared/services/plans.service';

@Component({
	selector: 'app-property-itemize-control',
	templateUrl: './property-itemize-control.component.html',
	styleUrls: ['./property-itemize-control.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PropertyItemizeControlComponent),
			multi: true
		}
	]
})
export class PropertyItemizeControlComponent implements OnInit, OnChanges {

	@Input() label: string
	@Input() labelSpan = 6
	@Input() placeholder: string
	@Input() suffix: string
	@Input() tabIndex = 1
	@Input() required = false
	@Input() locked? = false
	@Input() lockedDirectiveText? = ''
	@Input() isBaseModel: boolean

	@Input() checkLabel: string
	@Input() checkLabelTrue: string
	@Input() checkLabelFalse: string

	@Input() itemsOnly = false                      // if true, hide total field
	@Input() config: PropertyItemizeGroupConfig
	@Input() calcTotalFunc: Function
	@Input() checkInit = false
	@Input() totalFormat: any = '1.0-0'
	@Input() totalUnit = ''
	@Input() form: FormGroup
	@Input() align = ''
	@Input() displayCheck = true
	@Input() title: string
	@Input() leftMargin = true

	@Input() featureName: string
	@Input() ruleId?: string

	@Input() externalCheck: Observable<boolean>
	@Output() checkedChange: EventEmitter<boolean> = new EventEmitter(this.checkInit)

	_totalValue: any = null
	_itemConfigs: PropertyItemizeControlConfig[] = []
	checkControlId: string

	checked: boolean

	calculationSubscription: Subscription
	checkSubscription: Subscription

	// reactive form for select area
	formSelect: any = {}

	showSubscriptionRequired: boolean
	showLocked: boolean

	constructor(public translate: TranslateService, 
		private router: Router,
		private plansService: PlansService) {}

	async ngOnInit() {
		this.checkControlId = PropertyFormHelper.genId()

		const { upgradeRequired, requiredPlan} = await this.plansService.minimumRequiredPlan(this.ruleId)
		this.showSubscriptionRequired = upgradeRequired

		this.showLocked = this.isBaseModel === true && this.ruleId && !this.showSubscriptionRequired

		this.setupCalculation()

		// Force the initial state of the checkbox
		if (this.checkInit !== undefined) {
			this.checked = this.checkInit
		}
		else {
			if (this.items.value.filter(x => x.amount).length) {
				this.checked = true
			}
		}

		if (this.calcTotalFunc && !this.itemsOnly) {
			try {
				this.convertToNumbers(this.config.items)
				this._totalValue = this.calcTotalFunc(this.config.items)
			}
			catch (e) {
				this._totalValue = 0
			}

			// calculate the sum if some non null items are present
			if (this.form.get('items').value.filter(x => x.amount).length) {
				this._totalValue = this.calcTotalFunc(this.form.get('items').value)
				this.form.get('total').setValue(this._totalValue)
			}
		}

		if (this.externalCheck) {
			this.externalCheck
				.pipe(takeWhile(() => Boolean(this.form)))
				.subscribe(checked => {
					this.checked = checked
				})
		}
	}

	convertToNumbers(itemConfigs) {
		itemConfigs.forEach((x: any) => x.amount = typeof(x.amount) === 'string' ? parseFloat(x.amount.replace(',', '')) :  x.amount)
		return itemConfigs
	}

	onSelectChange(event) {
		const value = event.target.value
		try {
			(this.items as FormArray).controls.find(control => control.value.name === 'amortization').get('amount').setValue(value);
		}
		catch (err) {
			console.log(err)
		}
	}

	setupCalculation() {

		// when items value change, update the total
		this.items.valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((configs: PropertyItemizeControlConfig[]) => {
				this._itemConfigs = configs

				if (!this.itemsOnly && this.calcTotalFunc && this.checked) {
					this.convertToNumbers(this._itemConfigs)
					this._totalValue = this.calcTotalFunc(this._itemConfigs)
					this.form.get('total').setValue(this._totalValue)
				}
			})


		// if the total is changed by the user, reset the items
		if (!this.itemsOnly) {
			this.form.controls.total.valueChanges
			.pipe(
				takeWhile(() => Boolean(this.form))
			)
			.subscribe(value => {
				if (value !== this._totalValue && this._totalValue !== 0 && this.checked) {
					this._totalValue = value

					this.items.setValue(this.items.value.map(cv => ({
						...cv,
						amount: null
					})))
				}
			})
		}
	}

	get itemControls(): FormControl[] {
		const controls = (this.form.controls.items as FormArray).controls as FormControl[]
		return controls
	}

	get items() {
		return this.form.get('items') as FormArray
	}

	onCheckChange(checked: boolean) {
		this.checked = checked

		if (!this.itemsOnly) {
			if (checked) {
				this.form.controls.total.disable()
			} else {
				this.form.controls.total.enable()
			}
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes && changes.check && changes.check.currentValue) {
			this.checked = changes.check.currentValue
		}
	}
}
