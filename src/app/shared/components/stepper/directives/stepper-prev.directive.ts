import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { StepperComponent } from '@app/shared/components/stepper/stepper/stepper.component';

@Directive({
	selector: '[appStepperPrev]'
})
export class StepperPrevDirective {
	@Input() stepper: StepperComponent;

	constructor() { }

	@HostListener('click') onClick() {
		if (this.stepper) {
			this.stepper.prev();
		}
	}
}
