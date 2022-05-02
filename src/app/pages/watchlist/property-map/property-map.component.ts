import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-property-map',
	templateUrl: './property-map.component.html',
	styleUrls: ['./property-map.component.scss']
})
export class PropertyMapComponent implements OnInit {

	propertyDocId = ''

	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.propertyDocId = this.route.snapshot.paramMap.get('id')
	}

}
