import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Meter } from '@app/core/models/meter.interface';

@Component({
	selector: 'app-meter',
	templateUrl: './meter.component.html',
	styleUrls: ['./meter.component.scss']
})
export class MeterComponent implements OnInit, AfterViewInit {

	@Input() meter: Meter

	low: number
	media: number
	high: number
	value: number
	units: string
	labels: any[]

	marginLeft: any;
	lineHeight: any;

	constructor() {	}

	ngOnInit() {}

	ngAfterViewInit(): void {
		setTimeout(() => {
			const degreeLeft = (this.meter.value - this.meter.low) / (this.meter.high - this.meter.low) * 120 + 30
			this.marginLeft = 10 + 40 * (1 - Math.cos(degreeLeft * Math.PI / 180)) + 'vw'
			const degreeHeight = degreeLeft - 90
			this.lineHeight = 4 + 40 * (1 - Math.cos(degreeHeight * Math.PI / 180)) + 'vw'
		}, 1000)
	
	}

}
