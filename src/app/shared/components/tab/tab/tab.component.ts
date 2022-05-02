import {
	AfterContentInit,
	AfterViewInit,
	Component,
	ContentChild, HostBinding,
	Input,
	OnInit,
	TemplateRef,
	ViewChild
} from '@angular/core';
import { TabIndicatorComponent } from '@app/shared/components/tab/tab-indicator/tab-indicator.component';

@Component({
	selector: 'app-tab',
	template: `
        <ng-template #labelTpl1>
            <ng-content select="app-tab-indicator"></ng-content>
        </ng-template>
        <ng-template #labelTpl2>
            <app-tab-indicator>
                <span class="indicator-label">{{label}}</span>
            </app-tab-indicator>
        </ng-template>
        <ng-content></ng-content>
    `,
	styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, AfterViewInit, AfterContentInit {
	@Input() label: string;

	@ContentChild(TabIndicatorComponent, {static: false}) tabIndicator: TabIndicatorComponent;

	@ViewChild('labelTpl1', {static: true}) labelTemplate1: TemplateRef<any>;
	@ViewChild('labelTpl2', {static: true}) labelTemplate2: TemplateRef<any>;

	labelTemplate: TemplateRef<any>;

	@HostBinding('class.active')
	get active() {
		return this._active;
	}
	set active(value: boolean) {
		this._active = value;
	}
	_active = false;

	constructor() { }

	ngOnInit() {
	}

	ngAfterViewInit() {
	}

	ngAfterContentInit() {
		if (this.tabIndicator) {
			this.labelTemplate = this.labelTemplate1;
		} else if (!this.labelTemplate && this.label) {
			this.labelTemplate = this.labelTemplate2;
		}
	}
}
