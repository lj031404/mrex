import { Component, HostBinding } from '@angular/core';

@Component({
	selector: 'app-step-trigger',
	template: `
        <div class="step-indicator"></div>
		<ng-content select=".trigger-icon"></ng-content>
        <ng-content select=".trigger-label"></ng-content>

        <div class="step-horizontal-line"></div>
        <div class="step-vertical-line"></div>
    `,
	styleUrls: ['./step-trigger.component.scss']
})
export class StepTriggerComponent {

	@HostBinding('class.step-trigger') hostClassName = true;
	@HostBinding('class.active') active = false;
	@HostBinding('class.interacted') interacted = false;

	constructor() { }

	activate() {
		this.interacted = true;
		this.active = true;
	}
	deactivate() {
		this.active = false;
	}
	reset() {
		this.interacted = false;
		this.active = false;
	}
}
