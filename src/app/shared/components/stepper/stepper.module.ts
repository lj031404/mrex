import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepperComponent } from './stepper/stepper.component';
import { StepComponent } from './step/step.component';
import { StepControllerComponent } from './step-controller/step-controller.component';
import { StepTriggerComponent } from './step-trigger/step-trigger.component';
import { StepperNextDirective } from './directives/stepper-next.directive';
import { StepperPrevDirective } from './directives/stepper-prev.directive';

@NgModule({
	declarations: [StepperComponent, StepComponent, StepControllerComponent, StepTriggerComponent, StepperNextDirective, StepperPrevDirective],
	imports: [
		CommonModule
	],
	exports: [
		StepperComponent,
		StepComponent,
		StepControllerComponent,
		StepTriggerComponent,
		StepperNextDirective,
		StepperPrevDirective
	]
})
export class StepperModule { }
