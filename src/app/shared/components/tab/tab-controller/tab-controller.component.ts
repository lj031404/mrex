import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
	selector: 'app-tab-controller',
	template: '<ng-content></ng-content>',
	styleUrls: ['./tab-controller.component.scss']
})
export class TabControllerComponent implements OnInit {

	@HostBinding('class.app-tab-controller') hostClassName = true;

	constructor() { }

	ngOnInit() {
	}

}
