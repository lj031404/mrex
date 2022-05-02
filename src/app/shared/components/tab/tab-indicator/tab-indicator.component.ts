import { Component, HostBinding } from '@angular/core';

@Component({
	selector: 'app-tab-indicator',
	template: `
        <a class="tab-indicator">
            <ng-content select=".indicator-icon"></ng-content>
            <ng-content select=".indicator-label"></ng-content>
        </a>
        <ng-content select="[slot='custom']"></ng-content>
    `,
	styleUrls: ['./tab-indicator.component.scss']
})
export class TabIndicatorComponent {

	@HostBinding('class.app-tab-indicator') hostClassName = true;
}
