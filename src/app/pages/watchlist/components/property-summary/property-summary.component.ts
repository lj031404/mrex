import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-property-summary',
	templateUrl: './property-summary.component.html',
	styleUrls: ['./property-summary.component.scss']
})
export class PropertySummaryComponent implements OnInit {
	@Input() property: any
	@Input() hypothesisData: any

	price
	residentialDistribution: any

	constructor() { }

	ngOnInit() {

		this.residentialDistribution = Object.keys(this.property.residentialDistribution)
										.filter(k => this.property.residentialDistribution[k])
										.map(k => {
											return { label: k, count: this.property.residentialDistribution[k] }
										})


	}

}
