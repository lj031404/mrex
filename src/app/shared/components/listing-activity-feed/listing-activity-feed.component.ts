import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ListingActivityFeed } from '@app/core/models/listing-item.interface';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs-compat/Observable';

@Component({
	selector: 'app-listing-activity-feed',
	templateUrl: './listing-activity-feed.component.html',
	styleUrls: ['./listing-activity-feed.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingActivityFeedComponent implements OnInit, OnDestroy {

	@Input() feedData$: Observable<ListingActivityFeed[]>
	public feedData: ListingActivityFeed[] = []

	subscription: Subscription

	constructor(private changeDetectorRef: ChangeDetectorRef) {
	}

	ngOnInit() {
		this.subscription = this.feedData$.subscribe(feedData => {
			this.feedData = feedData
			this.feedData.sort((a: any, b: any) => b.feedDate - a.feedDate)
			this.changeDetectorRef.markForCheck()
		})
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}
}
