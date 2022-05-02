import { Component, ContentChildren, HostBinding, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { StepperComponent } from '@app/shared/components/stepper/stepper/stepper.component';
import { StepTriggerComponent } from '@app/shared/components/stepper/step-trigger/step-trigger.component';

@Component({
	selector: 'app-step-controller',
	template: `
        <ng-content></ng-content>
    `,
	styleUrls: ['./step-controller.component.scss']
})
export class StepControllerComponent implements OnInit, OnDestroy {
	@Input() stepper: StepperComponent;
	@ContentChildren(StepTriggerComponent) triggers: QueryList<StepTriggerComponent>;

	@HostBinding('class.app-step-controller') hostClassName = true;

	alive = true;

	constructor() { }

	ngOnInit() {
		if (this.stepper) {
			this.stepper.changed$.pipe(
				takeWhile(() => this.stepper.alive && this.alive)
				).subscribe(index => {
				this.triggers.forEach((trigger, id) => {
					if (index === id) {
						trigger.activate();
						return;
					}
					trigger.deactivate();
				});
			});
		}
	}

	ngOnDestroy() {
		this.alive = false;
	}
}
