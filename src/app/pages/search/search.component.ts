import { Component, OnDestroy, OnInit } from '@angular/core';
import { MarketinfoshareService } from '../market/adapter/marketinfoshare.service';
import { MarketMiddlewareService, FilterPad } from '@app/api-middleware/market-middleware.service';
import { RouterMap } from '@app/core/utils/router-map.util';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PropertySearchResultOnMap } from '@app-models/property-search.interface';
import { Subscription } from 'rxjs';
import { HomeService } from '@app/core/services/home.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
	address = ''
	filter: FilterPad
	subscription: Subscription = new Subscription()
	isLoading
	constructor(
		private infoService: MarketinfoshareService,
		private middleware: MarketMiddlewareService,
		private readonly router: Router,
		private homeService: HomeService
	) {
		this.homeService.inputAddress$.subscribe(res => {
			this.address = res
		})
	}

	ngOnInit() {
		this.subscription.add(
			this.middleware.filterChange$.pipe(
				).subscribe(async (response) => {
					this.isLoading = true
					this.middleware.properties = await this.loadProperties()
					this.isLoading = false
				}, err => {
					this.isLoading = false
				})
		)
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
		this.homeService.homeSearchKey = null
	}

	navigateToHomeScreen = () => {
		this.router.navigate([RouterMap.Home.url([])])
		this.homeService.homeSearchKey = null
	}

	addressClick(address: any) {
		this.filter = this.middleware.getCurrentFilterCriteria()
	
		if (address && this.filter) {
			this.homeService.getInputAddress(address.description)
			this.filter.placeId = address.place_id
			this.filter.address = address.description
			this.infoService.getInputAddress(address.description)
			this.filter.bounds = null // let agp-map find the best bound when we know the place
			this.middleware.isSearchAddress = true
			this.middleware.setFilterCriteria(this.filter, { resizeMap: true })
		}
		else {
			this.filter.placeId = null
			this.filter.address = null
			this.homeService.getInputAddress(address.description)
		}
	}

	onUpdatePlace(res: any) {
		this.filter.coordinates = res.coordinates.coordinates
		this.filter.bounds = null // let agp-map find the best bound when we know the place
		this.middleware.setFilterCriteria(this.filter)
	}

	async loadProperties() {
		const res = await this.middleware.loadPropertiesOnCurrentMap().toPromise()
		return res.properties
	}

}
