import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, ControlValueAccessor {

	constructor() { }

	ngOnInit() {
	}

	registerOnChange(fn: any): void {
	}

	registerOnTouched(fn: any): void {
	}

	setDisabledState(isDisabled: boolean): void {
	}

	writeValue(obj: any): void {
	}

}
