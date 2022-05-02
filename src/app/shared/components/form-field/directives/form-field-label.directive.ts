import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
	selector: '[appFormFieldLabel]'
})
export class FormFieldLabelDirective implements OnInit {
	@Input() span: number;

	constructor(
		private el: ElementRef
	) {
		el.nativeElement.className = 'form-label form-label--field';
	}

	ngOnInit() {
		if (this.span > 0 && this.span < 12) {
			this.el.nativeElement.setAttribute('cols', this.span.toString());
		}
	}
}
