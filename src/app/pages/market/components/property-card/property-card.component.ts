import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { ListingType } from '@app/api_generated'
import { Router } from '@angular/router'
import { RouterMap } from '@app/core/utils/router-map.util'
import { PropertyAddressPipe } from '@app-pipes/property-address.pipe'
import { ListingCard } from '@app/core/models/listing-item.interface'
import { TranslateService } from '@ngx-translate/core'
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service'

@Component({
	selector: 'app-property-card',
	templateUrl: './property-card.component.html',
	styleUrls: ['./property-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyCardComponent implements OnInit, OnChanges {
	ListingType = ListingType

	@Input() isWatched = false
	@Input() countModels = 0
	@Input() listing: ListingCard

	subscribe = true
	first: string
	second: string
	propertyAddressPipe = new PropertyAddressPipe()
	heatingType: string

	constructor(
		private router: Router,
		private translate: TranslateService,
		public marketMiddleware: MarketMiddlewareService,
		public changeDetectorRef: ChangeDetectorRef
	) {
	}

	@HostListener('click', ['$event']) async goto(event: any) {
		this.router.navigate([ RouterMap.Market.url([RouterMap.Market.PROPERTIES, this.listing.propertyId]) ])
	}

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {
		try {
			const listing = this.listing = changes.listing.currentValue
			this.first = this.propertyAddressPipe.transform(listing.address, 'first')
			this.second = this.propertyAddressPipe.transform(listing.address, 'second')
			if (listing && listing.heating) {
				this.heatingType = this.listing.heating.map(heat => this.translate.instant('heating_type.' + heat.type)).join(', ')
			}
			this.changeDetectorRef.detectChanges()
		}
		catch (err) { }
	}

	viewWatch() {
		this.router.navigate([
			RouterMap.Watchlist.url([this.listing.propertyId, RouterMap.Watchlist.ACTIVITY])
		])
	}

	viewModels() {
		this.router.navigate([
			RouterMap.Watchlist.url([this.listing.propertyId, RouterMap.Watchlist.MODELING])
		])
	}

}
