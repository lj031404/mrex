import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumericMaskClean]'
})
export class NumericMaskCleanDirective {

  constructor(
	private elementRef: ElementRef,
	private model: NgControl
  ) { }

  @HostListener('input') inputChange() {
	const newValue = this.elementRef.nativeElement.value.replace(/\D/g, '')
	// Note that you need to pass the 2nd argument with the following values:
	this.model.control.setValue(newValue, {
		emitEvent: false,
		emitModelToViewChange: false,
		emitViewToModelChange: false
	});
  }

}





