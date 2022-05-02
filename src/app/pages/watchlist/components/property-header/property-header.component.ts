import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PropertyHeader } from '@app/core/models/property.interface';
import { RESOLUTIONS } from '@app/pages/market/market-listing/market-listing.component';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs-compat/Observable';

@Component({
	selector: 'app-property-header',
	templateUrl: './property-header.component.html',
	styleUrls: ['./property-header.component.scss']
})
export class PropertyHeaderComponent implements OnInit, OnDestroy {

	@Input() header$: Observable<PropertyHeader>
	header: PropertyHeader
	slider = {}
	_subscription: Subscription = new Subscription()

	constructor(private changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {
		this._subscription.add(
			this.header$.subscribe((header) => {
				this.header = header
				if (this.header) {
					this.slider = {
						pictures: this.header.pictures.filter(p => p.width ? p.width === RESOLUTIONS[480] : true)
					}
				}
				this.changeDetectorRef.markForCheck()
			})
		)
	}

	ngOnDestroy() {
		this._subscription.unsubscribe()
	}

}
