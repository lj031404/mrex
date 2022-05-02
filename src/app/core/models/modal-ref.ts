import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';

export class ModalRef {
	hostComponentRef: ComponentRef<any>;

	private readonly closedSubject = new Subject();
	closed$ = this.closedSubject.asObservable();

	constructor(hostComponentRef: ComponentRef<any>) {
		this.hostComponentRef = hostComponentRef;
	}

	closeModal(data?: any) {
		this.closedSubject.next(data);
	}
}
