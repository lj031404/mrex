import { Directive, HostListener, Input } from '@angular/core'
import { StepperComponent } from '@app/shared/components/stepper/stepper/stepper.component'

@Directive({
	selector: '[appStepperNext]'
})
export class StepperNextDirective {
	@Input() stepper: StepperComponent

	constructor() { }

	@HostListener('click') onClick() {
		this.stepper.click()

		if (this.stepper) {
			this.stepper.next()
		}
	}
}
