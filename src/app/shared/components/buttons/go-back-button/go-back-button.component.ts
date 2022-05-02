import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-go-back-button',
	template: `
        <a [className]="className" (click)="onClick()">
            <i class="fa fa-chevron-left"></i>
        </a>
    `,
	styleUrls: ['./go-back-button.component.scss']
})
export class GoBackButtonComponent implements OnInit {
	@Input() classes: string[];
	@Input() action: () => void;
	className = '';

	constructor(
		private location: Location,
		private zone: NgZone
	) { }

	ngOnInit() {
		if (this.classes && this.classes.length) {
			this.className = this.classes.join(' ');
		}

		document.addEventListener('backbutton', this.onClick, false)
	}

	onClick() {
		if (this.action) {
			this.action()
		} else {
			this.zone && this.zone.run(() => {
				this.location.back()
			})
		}
	}

}
