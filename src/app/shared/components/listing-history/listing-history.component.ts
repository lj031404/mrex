import { Component, OnInit, Input } from '@angular/core';
import { ListingHistoryItem } from '@app/core/models/listing-item.interface';

@Component({
	selector: 'app-listing-history',
	templateUrl: './listing-history.component.html',
	styleUrls: ['./listing-history.component.scss']
})
export class ListingHistoryComponent implements OnInit {

	@Input() lists: ListingHistoryItem[]

	constructor() { }

	ngOnInit() {
	}

}
