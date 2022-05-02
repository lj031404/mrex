import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
	selector: 'app-step',
	template: `
        <ng-template>
            <ng-content></ng-content>
        </ng-template>
    `,
	styleUrls: ['./step.component.scss']
})
export class StepComponent {
	@Input() stepControl: AbstractControl;
	@Output() interacted = new EventEmitter();
	@Output() activated = new EventEmitter();
	@ViewChild(TemplateRef, {static: true}) content: TemplateRef<any>;

	get completed(): boolean {
		return !(this.stepControl && this.stepControl.invalid);
	}

	interact() {
		this.interacted.emit();
	}

	activate() {
		this.activated.emit();
	}
}
