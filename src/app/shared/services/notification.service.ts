import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NotificationInterface } from '@app/core/models/notification';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private _subject = new Subject<NotificationInterface>();

	get notification$(): Observable<NotificationInterface> {
		return this._subject.asObservable()
	}

	private _index = 0;

	constructor() { }

	show(imageUrl: string, title: any, message: any, delay: number) {
		this._subject.next(new NotificationInterface(this._index++, imageUrl, title, message, delay));
	}

}
