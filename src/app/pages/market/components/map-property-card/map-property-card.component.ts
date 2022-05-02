import { Component, Input } from '@angular/core'
import { ListingShort, ListingType } from '@app/api_generated'
import { Router } from '@angular/router'
import { RouterMap } from '@app/core/utils/router-map.util'
import { PropertyAddressPipe } from '@app-pipes/property-address.pipe'

@Component({
	selector: 'app-map-property-card',
	templateUrl: './map-property-card.component.html',
	styleUrls: ['./map-property-card.component.scss']
})
export class MapPropertyCardComponent {
	ListingType = ListingType

	@Input() property: ListingShort

	first: string
	second: string
	propertyAddressPipe = new PropertyAddressPipe()
	heatingType: string
	slider

	constructor(
		private router: Router
		) {
	}

	async ngOnChanges() {
		this.first = this.propertyAddressPipe.transform(this.property.address, 'first')
		this.second = this.propertyAddressPipe.transform(this.property.address, 'second')
		if (this.property && this.property.heating) {
			this.heatingType = this.property.heating.map(heat => heat.type).join(', ')
		}

		this.slider = {
			pictures: this.property.images
		}
	}

	viewDetail(id: string) {
		this.router.navigateByUrl(RouterMap.Market.url([ RouterMap.Market.PROPERTIES, id ]))
	}

}
