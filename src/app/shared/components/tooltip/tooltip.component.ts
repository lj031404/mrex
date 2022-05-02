import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

declare var $

@Component({
	selector: 'app-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

	@Input() text = ''
	@Input() placement = 'top'

	public id = Math.trunc(Math.random() * 100000)

	constructor() { }

	ngOnInit() {
	}

	click(event: Event) {
		event.stopPropagation()
		$('#tooltip-' + this.id).tooltip({ placement: 'right', title: this.text })
		$('#tooltip-' + this.id).tooltip('toggle')
	}

}
