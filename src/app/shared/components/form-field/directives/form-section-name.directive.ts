import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[appFormSectionName]'
})
export class FormSectionNameDirective {
	constructor(el: ElementRef) {
		el.nativeElement.className = 'form-label form-label--section';
	}
}
