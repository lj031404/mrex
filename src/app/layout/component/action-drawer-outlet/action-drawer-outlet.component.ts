import {
	AfterContentInit,
	Component,
	ContentChild,
	ContentChildren, EventEmitter,
	HostBinding,
	OnDestroy, Output,
	QueryList,
	ViewChild,
	ElementRef
} from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { ActionDrawerComponent } from '@app/layout/component/action-drawer/action-drawer.component';
import { ActionButtonComponent } from '@app/shared/components/buttons/action-button/action-button.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-action-drawer-outlet',
	templateUrl: './action-drawer-outlet.component.html',
	styleUrls: ['./action-drawer-outlet.component.scss']
})
export class ActionDrawerOutletComponent implements AfterContentInit, OnDestroy {
	@HostBinding('class.app-action-drawer-outlet') hostClassName = true;

	@ContentChild('mainDrawer', { static: false }) mainDrawerComponent: ActionDrawerComponent;
	@ContentChild(ActionButtonComponent, { static: false }) actionButtonComponent: ActionButtonComponent;

	@ContentChildren(ActionDrawerComponent) drawerComponentList: QueryList<ActionDrawerComponent>;

	@Output() closed = new EventEmitter();

	@ViewChild('drawerContent', { static: true }) drawerContent: ElementRef<HTMLInputElement>
	alive = true;
	isActiveDrawer = false;
	constructor(private translate: TranslateService) { }

	ngAfterContentInit() {
		if (this.mainDrawerComponent) {
			this.mainDrawerComponent.closed$.pipe(
				takeWhile(() => this.alive)
			).subscribe(() => {
				this.onClosedMainDrawer();
			})
		}
	}

	ngOnDestroy() {
		this.alive = false;
	}

	openDrawer() {
		if (this.mainDrawerComponent) {
			this.actionButtonComponent.active = false;
			this.mainDrawerComponent.open();
			this.isActiveDrawer = true;
		}
	}

	onClosedMainDrawer() {
		if (this.drawerComponentList.toArray().length === 1) {
			this.closed.emit();
		}

		this.isActiveDrawer = false;
		if (this.actionButtonComponent) {
			this.actionButtonComponent.active = true;
		}
	}

	get actionDrawer() {
		let height = 0
		try {
			height = document.getElementsByClassName('action-drawer-container')[0].clientHeight
		}
		catch (err) {}
		
		return {
			'height': `calc(100vh - ${height}px )`
		}
	}
	

	closeDrawers() {
		this.closed.emit();

		this.isActiveDrawer = false;
		if (this.drawerComponentList) {
			this.drawerComponentList.toArray().forEach(component => component.close());
		}
		if (this.actionButtonComponent) {
			this.actionButtonComponent.active = true;
		}
	}
}
