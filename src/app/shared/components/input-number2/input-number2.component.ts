import { Component, OnInit, Input, HostListener, SimpleChanges, Output, EventEmitter, HostBinding } from '@angular/core';
import { formatNumber } from '@angular/common'
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-number2',
  templateUrl: './input-number2.component.html',
  styleUrls: ['./input-number2.component.scss']
})
export class InputNumber2Component implements OnInit {
	@Input() placeholder: string
	@Input() digitsFormat: string
	@Input() control: FormControl
	@Input() disabled = false
 	@Input() title = ''
	@Output() onChange: EventEmitter<number> = new EventEmitter()

	element: HTMLInputElement

	form: FormGroup
	formattedValue: string

	subscribeSwitch = true
	@HostBinding('class.disabled') classHostDisabled = true

	@HostBinding('class.form-field') classHostName = true
	@HostBinding('class.ng-blank')
	get blank() {
		return this.control && !this.control.value
	}
	@HostBinding('class.ng-touched')
	get ngTouched() {
		return this.control && this.control.touched
	}

	@HostBinding('class.ng-untouched')
	get ngUntouched() {
		return this.control && this.control.untouched
	}

	@HostBinding('class.ng-pristine')
	get ngPristine() {
		return this.control && this.control.pristine
	}

	@HostBinding('class.ng-dirty')
	get ngDirty() {
		return this.control && this.control.dirty
	}

	@HostBinding('class.ng-valid')
	get ngValid() {
		return this.control && this.control.valid
	}

	@HostBinding('class.ng-invalid')
	get ngInvalid() {
		return this.control && this.control.invalid 
	}

	@HostBinding('class.ng-pending')
	get ngPending() {
		return this.control && this.control.pending
	}
	constructor() { }

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
			this.changeValue(+formattedInteger)
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

	decrease() {
		const numberPattern = /[+-]?\d+(\.\d+)?/g
		let rawNumber = 0

		if (this.form.get('field').value !== null) {
			rawNumber = parseFloat(this.form.get('field').value.replace(',', '').match(numberPattern).join(''))
		}
		if (rawNumber > 0) {
			rawNumber--
			this.form.get('field').setValue(rawNumber)
			this.changeValue(rawNumber)
		}
		
	}

	increase() {
		const numberPattern = /[+-]?\d+(\.\d+)?/g
		let rawNumber = 0
		if (this.form.get('field').value !== null) {
			rawNumber = parseFloat(this.form.get('field').value.replace(',', '').match(numberPattern).join(''))
		}
		
		rawNumber++
		this.form.get('field').setValue(rawNumber)
		this.changeValue(rawNumber)
		
	}

	changeValue(value: number) {
		this.control.setValue(value)
		this.onChange.emit(value)
	}

}
