import { AfterContentInit, Component, ContentChildren, OnInit, QueryList, TemplateRef } from '@angular/core';
import { TabComponent } from '@app/shared/components/tab/tab/tab.component';

@Component({
	selector: 'app-tab-group',
	template: `
        <app-tab-controller>
            <div class="tab-indicator-wrapper" (click)="onTabClicked(tab)" *ngFor="let tab of tabs">
                <ng-container [ngTemplateOutlet]="tab.labelTemplate" *ngIf="tab.labelTemplate"></ng-container>
                <app-tab-indicator *ngIf="!tab.labelTemplate"></app-tab-indicator>
            </div>
        </app-tab-controller>
        <div class="tabs-wrapper">
            <ng-content></ng-content>
        </div>
    `,
	styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent implements OnInit, AfterContentInit {
	@ContentChildren(TabComponent) tabComponentList: QueryList<TabComponent>;

	tabs: TabComponent[] = [];

	constructor() { }

	ngOnInit() {
	}

	ngAfterContentInit() {
		this.tabs = this.tabComponentList ? this.tabComponentList.toArray() : [];
		if (this.tabs.length) {
			this.tabs[0].active = true;
		}
	}

	onTabClicked(tab: TabComponent) {
		this.tabs.forEach(_tab => {
			_tab.active = tab === _tab;
		});
	}
}
