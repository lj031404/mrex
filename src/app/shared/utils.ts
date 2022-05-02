import { ValidatorFn, FormArray, FormControl } from '@angular/forms';


// https://coryrylan.com/blog/creating-a-dynamic-checkbox-list-in-angular

export function minSelectedCheckboxes(min = 1) {
	const validator: ValidatorFn = (formArray: FormArray) => {
	  const totalSelected = formArray.controls
		// get a list of checkbox values (boolean)
		.map(control => control.value)
		// total up the number of checked checkboxes
		.reduce((prev, next) => next ? prev + next : prev, 0);

	  // if the total is not greater than the minimum, return the error message
	  return totalSelected >= min ? null : { required: true };
	};

	return validator;
}

export function matchOtherValidator(otherControlName: string) {

	let thisControl: FormControl;
	let otherControl: FormControl;

	return function matchOtherValidate(control: FormControl) {

		if (!control.parent) {
			return null;
		}

		// Initializing the validator.
		if (!thisControl) {
			thisControl = control;
			otherControl = control.parent.get(otherControlName) as FormControl;
			if (!otherControl) {
				throw new Error('matchOtherValidator(): other control is not found in parent group');
			}
			otherControl.valueChanges.subscribe(() => {
				thisControl.updateValueAndValidity();
			});
		}

		if (!otherControl) {
			return null;
		}

		if (otherControl.value !== thisControl.value) {
			return {
				matchOther: true
			};
		}

		return null;

	}

}

export function refreshMaterialLabels() {
	setTimeout(() => {
		window['jQuery']('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
	}, 10);
}

export function roundDecimals( numb: number, decimalCount: number = 2) {
	// Round a float number to 2 decimals by default
	//  0.1555555555555555555 = 0.15, 125 = 125, 0.10 = 0.1
	const divider = Math.pow(10, decimalCount );
	return Math.round( numb * divider ) / divider;
}

export function getQuillConfig() {

	return {
			// clipboard: {
			// 	matchVisual: false
			// },
		toolbar: [
			// ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			// ['blockquote', 'code-block'],

			// [{ 'list': 'ordered'}, { 'list': 'bullet' }],
			// [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			// [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

			// [{ 'align': [] }],

			// ['link'/*, 'image', 'video'*/]                         // link and image, video

			// [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
			[{ 'header': [1, 2, 3, false] }],

			['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			// ['blockquote', 'code-block'],

			[/*{ 'list': 'ordered'},*/ { 'list': 'bullet' }],
			// [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			// [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

			// [{ 'align': [] }],

			['link'/*, 'image', 'video'*/],                         // link and image, video
			['clean']                                             // remove formatting button
		]
	};
}

export class TimeDuration {
	_tic: Date
	_toc: Date
	_prefix: string

	constructor(prefix: string = '') {
		this._prefix = prefix
		this.tic()
	}

	tic() {
		this._tic = new Date()
		return this
	}

	toc() {
		this._toc = new Date()
		return this
	}

	duration() {
		return (this._toc.getTime() - this._tic.getTime()) / 1000
	}

	print(str = '') {
		console.log(`${this._prefix ? '[' + this._prefix + ']' : ''} ${str ? '[' + str + ']' : ''} DURATION: ${this.duration()} seconds`)
	}

}
