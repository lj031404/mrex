import { Component, OnInit, Input, SimpleChange, ElementRef, HostListener, OnChanges, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { formatNumber } from '@angular/common'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'app-input-number',
	templateUrl: './input-number.component.html',
	styleUrls: ['./input-number.component.scss']
})

export class InputNumberComponent implements OnInit, OnChanges {

	@Input() tabindex: string
	@Input() placeholder: string
	@Input() digitsFormat: string
	@Input() control: FormControl
	@Input() disabled = false

	element: HTMLInputElement

	form: FormGroup
	formattedValue: string

	subscribeSwitch = true

	constructor() {
	}

	ngOnInit() {
		this.form = new FormGroup({
			field: new FormControl()
		})

		try {
			if (this.control.value !== null) {
				const formattedInteger = formatNumber(this.control.value, 'en-US', this.digitsFormat)
				this.form.get('field').setValue(formattedInteger)
			}

			this.control.valueChanges.subscribe(x => {
				if (this.subscribeSwitch) {

					const digitFormat2 = `${this.digitsFormat.split('.')[0]}.0-${this.digitsFormat.split('.')[1].split('-')[1]}`

					if (x !== null) {
						const formattedInteger = formatNumber(x, 'en-US', digitFormat2)

						// rewrite the digit formatting for better UX during the edition
						this.form.get('field').setValue(formattedInteger)
					}

					// WALK AROUND
					// This is ugly here, this is due to nested ngcontrols which doesn't propagate the field attributes!!
					// Lessons learn: never put nested ngControls inside <app-form-field> anymore!
					if (this.control.dirty) {
						this.form.get('field').markAsDirty()
					}
					if (this.control.touched) {
						this.form.get('field').markAsTouched()
					}
					if (this.control.pending) {
						this.form.get('field').markAsPending()
					}
					if (this.control.invalid) {
						this.form.get('field').setErrors({ 'incorrect': true })
					}
					else {
						this.form.get('field').setErrors(null)
					}
				}
			})
		}
		catch (err) {
			console.error(err)
		}
	}


	format(forceFormat = false) {

		const numberPattern = /[+-]?\d+(\.\d+)?/g
		let rawNumber = 0

		try {
			rawNumber = parseFloat(this.form.get('field').value.replace(',', '').match(numberPattern).join(''))
		}
		catch (e) { }

		// number of decimals
		const currentValue = this.form.get('field').value
		const decimals = currentValue !== undefined && currentValue !== null && currentValue.includes('.') && currentValue.split('.').splice(-1).pop().length || 0
		const allowedDecimals = parseInt(this.digitsFormat.split('-').splice(-1).pop(), 10)

		if (decimals >= allowedDecimals || forceFormat) {
			const formattedInteger = formatNumber(rawNumber, 'en-US', this.digitsFormat)

			this.subscribeSwitch = false

			this.form.get('field').setValue(formattedInteger)
			this.control.setValue(rawNumber)

		}

		this.subscribeSwitch = true
	}


	@HostListener('keyup', ['$event'])
	onKeyUp(e: Event) {
		this.rewrite()
	}

	rewrite() {
		try {
			const inputValue = this.form.get('field').value
			const formattedNumber = inputValue.replace(/^0+/, '')
			this.form.get('field').setValue(formattedNumber)
		}
		catch (err) { }
	}

	// detect changes of the value in the parent componemts
	@Input()
	set value(val: any) {
		try {
			const formattedInteger = formatNumber(val, 'en-US', this.digitsFormat)
			this.form.get('field').setValue(formattedInteger)
		}
		catch (e) { }
	}

	// Detect changes from the parent component and propagate these changes in this component
	ngOnChanges(changes: SimpleChanges) {
		if (this.form && changes.control) {
			const newVal = changes.control.currentValue.value
			const formattedInteger = formatNumber(newVal, 'en-US', this.digitsFormat)
			this.form.get('field').setValue(formattedInteger)
		}
	}
}
