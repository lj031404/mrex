import { Component, OnInit } from '@angular/core';
import { Meter } from '@app/core/models/meter.interface';

@Component({
	selector: 'app-meter-test',
	templateUrl: './meter-test.component.html',
	styleUrls: ['./meter-test.component.scss']
})
export class MeterTestComponent implements OnInit {

	meterInfo: Meter

	constructor() { }

	ngOnInit() {
		this.meterInfo = {
			low: 1000,
			media: 2000,
			high: 3000,
			value: 2700,
			units: '$',
			labels: ['Low', 'Median', 'High']
		}
	}
}
