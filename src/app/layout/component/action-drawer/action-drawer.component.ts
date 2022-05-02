import { AfterContentInit, Component, ContentChild, EventEmitter, HostBinding, OnDestroy, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { ActionDrawerCloseDirective } from '@app/layout/directives/action-drawer-close.directive';

@Component({
	selector: 'app-action-drawer',
	templateUrl: './action-drawer.component.html',
	styleUrls: ['./action-drawer.component.scss']
})
export class ActionDrawerComponent implements AfterContentInit, OnDestroy {
	@ContentChild(ActionDrawerCloseDirective, {static: false}) closeDirective: ActionDrawerCloseDirective;
	@Output() closed = new EventEmitter();

	@HostBinding('class.app-action-drawer') hostClassName = true;
	isActive = false;
	alive = true;

	closed$: Observable<any>;
	private closedSubject = new Subject();

	ngAfterContentInit() {
		this.closed$ = this.closedSubject.asObservable()

		if (this.closeDirective) {
			this.closeDirective.close.pipe(
				takeWhile(() => this.alive)
			).subscribe(() => {
				this.close()
				this.closedSubject.next()
			});
		}
	}

	ngOnDestroy() {
		this.alive = false;
		this.closedSubject.unsubscribe();
	}

	open() {
		this.isActive = true;
	}
	close() {
		this.closed.emit();
		this.isActive = false;
	}
}
