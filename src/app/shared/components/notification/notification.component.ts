import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationInterface } from '@app/core/models/notification';
import { Subscription } from 'rxjs';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

	notifications: NotificationInterface[] = []
	private _subscription: Subscription

	constructor(
		private notificationService: NotificationService
	) { }

	private _addNotification(notification: NotificationInterface) {
		this.notifications.push(notification)
		if (notification.delay !== 0) {
			setTimeout(() => this.hide(notification), notification.delay)
		}
	}

	ngOnInit() {
		this._subscription = this.notificationService.notification$.subscribe(
			notification => this._addNotification(notification)
		)
	}

	ngOnDestroy(): void {
		this._subscription.unsubscribe()
	}

	hide(notification: NotificationInterface) {
		this.notifications = this.notifications.filter(res => res.id !== notification.id)
	}
}
