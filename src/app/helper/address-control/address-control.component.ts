import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';

// removed to reduce bundle size!
//import csc from 'country-state-city'

@Component({
	selector: 'app-address-control',
	templateUrl: './address-control.component.html',
	styleUrls: ['./address-control.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AddressControlComponent),
			multi: true,
		}
	]
})
export class AddressControlComponent implements OnInit, ControlValueAccessor {
	
	@Input() startTabIndex = 1
	@Input() form: FormGroup
	@Input() isNew?: boolean
	statesOfCA = []
	get invalid() {
		return this.form.invalid
	}

	constructor(
		private fb: FormBuilder
	) {
		//this.statesOfCA = csc.getStatesOfCountry('CA')
		this.statesOfCA = [
			{
			   "name":"Alberta",
			   "isoCode":"AB",
			   "countryCode":"CA",
			   "latitude":"53.93327060",
			   "longitude":"-116.57650350"
			},
			{
			   "name":"British Columbia",
			   "isoCode":"BC",
			   "countryCode":"CA",
			   "latitude":"53.72666830",
			   "longitude":"-127.64762050"
			},
			{
			   "name":"Manitoba",
			   "isoCode":"MB",
			   "countryCode":"CA",
			   "latitude":"53.76086080",
			   "longitude":"-98.81387620"
			},
			{
			   "name":"New Brunswick",
			   "isoCode":"NB",
			   "countryCode":"CA",
			   "latitude":"46.56531630",
			   "longitude":"-66.46191640"
			},
			{
			   "name":"Newfoundland and Labrador",
			   "isoCode":"NL",
			   "countryCode":"CA",
			   "latitude":"53.13550910",
			   "longitude":"-57.66043640"
			},
			{
			   "name":"Northwest Territories",
			   "isoCode":"NT",
			   "countryCode":"CA",
			   "latitude":"64.82554410",
			   "longitude":"-124.84573340"
			},
			{
			   "name":"Nova Scotia",
			   "isoCode":"NS",
			   "countryCode":"CA",
			   "latitude":"44.68198660",
			   "longitude":"-63.74431100"
			},
			{
			   "name":"Nunavut",
			   "isoCode":"NU",
			   "countryCode":"CA",
			   "latitude":"70.29977110",
			   "longitude":"-83.10757700"
			},
			{
			   "name":"Ontario",
			   "isoCode":"ON",
			   "countryCode":"CA",
			   "latitude":"51.25377500",
			   "longitude":"-85.32321400"
			},
			{
			   "name":"Prince Edward Island",
			   "isoCode":"PE",
			   "countryCode":"CA",
			   "latitude":"46.51071200",
			   "longitude":"-63.41681360"
			},
			{
			   "name":"Quebec",
			   "isoCode":"QC",
			   "countryCode":"CA",
			   "latitude":"52.93991590",
			   "longitude":"-73.54913610"
			},
			{
			   "name":"Saskatchewan",
			   "isoCode":"SK",
			   "countryCode":"CA",
			   "latitude":"52.93991590",
			   "longitude":"-106.45086390"
			},
			{
			   "name":"Yukon",
			   "isoCode":"YT",
			   "countryCode":"CA",
			   "latitude":"35.50672150",
			   "longitude":"-97.76254410"
			}
		 ]
		console.log(this.statesOfCA)
	}

	onTouched = () => {}

	markAsTouched() {
		Object.keys(this.form.controls).forEach(fd => {
			this.form.controls[fd].markAsTouched()
		})
	}

	markAsDirty() {
		Object.keys(this.form.controls).forEach(fd => {
			this.form.controls[fd].markAsDirty()
		})
	}

	ngOnInit() {
	}

	registerOnChange(fn: any): void {
		this.form.valueChanges.pipe(
			takeWhile(() => Boolean(this.form))
		).subscribe(() => {
			const address = this.form.getRawValue()
			const pattern = new RegExp(/([0-9]*)\s?-\s?([0-9]*)/)
			const match = address.civicNumber.match(pattern)
			if (match && match[0] && match[1] && match[2]) {
				address.civicNumber = match[1]
				address.civicNumber2 = match[2]
			}
			fn(address)
		})
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	setDisabledState(isDisabled: boolean): void {
		if (isDisabled) {
			this.form.disable()
		} else {
			this.form.enable()
		}
	}

	writeValue(obj: any): void {
		if (obj) {
			this.form.patchValue(obj, { emitEvent: false })
		}
	}

}
