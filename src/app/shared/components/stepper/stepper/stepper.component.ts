import {
	AfterViewInit,
	Component,
	ContentChildren, EventEmitter,
	HostBinding, Input, OnDestroy,
	OnInit, Output,
	QueryList
} from '@angular/core';

import { StepComponent } from '@app/shared/components/stepper/step/step.component';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-stepper',
	template: `
        <div class="selected-step">
            <ng-container [ngTemplateOutlet]="_selected?.content"></ng-container>
        </div>
    `,
	styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input()
	get selectedIndex() {
		if (!this.steps || !this.steps.length) {
			return -1;
		}
		return this._selectedIndex;
	}
	set selectedIndex(index: number) {
		if (!this.steps) {
			this._selectedIndex = index;
			return;
		}

		this.markCurrentStepInteracted();
		if (this.canBeSelected(index)) {
			this._selectedIndex = index;
			this.present();
		}
	}
	protected  _selectedIndex = 0;

	_selected: StepComponent;

	@Input() orientation = 'horizontal';
	@Output() changed = new EventEmitter<number>();
	@Output() clicked = new EventEmitter<number>();
	@ContentChildren(StepComponent) steps: QueryList<StepComponent>;

	@HostBinding('class.app-stepper') hostClassName = true;
	@HostBinding('class.stepper-vertical')
	get vertical() {
		return this.orientation === 'vertical';
	}
	@HostBinding('class.stepper-horizontal')
	get horizontal() {
		return this.orientation === 'horizontal';
	}

	protected changedSubject = new Subject<number>();
	changed$ = this.changedSubject.asObservable();

	protected clickedSubject = new Subject<number>();
	clicked$ = this.clickedSubject.asObservable();

	alive = true;

	get canStepForward() {
		return Boolean(this.steps && this._selectedIndex < this.steps.length - 1);
	}
	get canStepBack() {
		return Boolean(this.steps && this._selectedIndex > 0);
	}

	get isFirstStep() {
		return Boolean(this.steps && this._selectedIndex === 0);
	}
	get isLastStep() {
		return Boolean(this.steps && this._selectedIndex === this.steps.length - 1);
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.alive = false;
	}

	ngAfterViewInit() {
		setTimeout(() => {
			if (this.canBeSelected(this._selectedIndex)) {
				this.present();
			}
		});
	}

	present() {
		this._selected = this.steps.toArray()[this._selectedIndex];
		this._selected.activate();

		this.changedSubject.next(this._selectedIndex);
		this.changed.emit(this._selectedIndex);
	}

	click() {
		this.clickedSubject.next(this._selectedIndex)
		this.clicked.emit(this._selectedIndex)
	}

	prev() {
		this.selectedIndex = Math.max(this._selectedIndex - 1, 0);
	}

	next() {
		if (this.validate()) {
			this.selectedIndex = Math.min(this._selectedIndex + 1, this.steps.length - 1)
		}
	}

	markCurrentStepInteracted() {

	}

	canBeSelected(index: number): boolean {
		if (!this.steps || !this.steps.length) {
			return false;
		}
		if (index < 0 || index >= this.steps.length) {
			return false;
		}

		return true;
	}

	validate() {
		if (this.steps) {
			const currentStep = this.steps.toArray()[this._selectedIndex];
			currentStep.interact();

			if (!currentStep.completed) {
				return false;
			}
			return true;
		}
		return false;
	}
}
