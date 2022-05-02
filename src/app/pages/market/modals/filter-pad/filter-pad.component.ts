import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import { LabelType } from 'ng5-slider'
import { Subject, Subscription } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ModalRef } from '@app-models/modal-ref'
import { MarketMiddlewareService, FilterPad } from '@app-middleware/market-middleware.service'
import { AppNumberPipe } from '@app-pipes/number.pipe'
import { ListingType, Coordinate } from '@app/api_generated'
import { MarketinfoshareService } from '../../adapter/marketinfoshare.service'

const dueTime = 500

@Component({
	selector: 'app-filter-pad',
	templateUrl: './filter-pad.component.html',
	styleUrls: ['./filter-pad.component.scss']
})
export class FilterPadComponent implements OnInit, OnDestroy {
	MARKET_LISTING_TYPE = ListingType

	@Input() modalRef: ModalRef

	numberPipe = new AppNumberPipe()

	totalCount = null
	filterCriteria: FilterPad
	sliderOptions: any

	valueChangeSubject = new Subject<any>()

	address: string
	yearConstruction: Array<{ value: number }>

	autocomplete
	isLoading: boolean
	subscriptions = new Subscription()

	constructor(
		private middleware: MarketMiddlewareService,
		private logger: NGXLogger,
		private infoService: MarketinfoshareService,
	) {
		this.subscriptions.add(this.infoService.inputAddress$.subscribe(res => this.address = res))
	}

	ngOnInit() {

		this.initSliderOptions()

		this.filterCriteria = this.middleware.getCurrentFilterCriteria()

		this.address = this.filterCriteria.address

		this.getSearchCount()

		this.valueChangeSubject.pipe(
			debounceTime(dueTime)
		).subscribe(() => this.onCriteriaValueChange())

	}

	addressClick(address: any) {
		this.isLoading = true
		this.filterCriteria = this.middleware.getCurrentFilterCriteria()
		if (address) {
			this.filterCriteria.placeId = address.place_id
			this.filterCriteria.address = address.description

			this.infoService.getInputAddress(address.description)

			this.middleware.updateMarketLoadingState(true)
			this.middleware.setFilterCriteria(this.filterCriteria, { resizeMap: true })
		} else {
			this.filterCriteria.placeId = null
			this.filterCriteria.address = null
			this.filterCriteria.bounds = null
			this.infoService.getInputAddress(null)
			this.infoService.getInputSearchAddress(null)
			this.middleware.updateMarketLoadingState(true)
			this.middleware.setFilterCriteria(this.filterCriteria, { resizeMap: true })
		}

	}

	ngOnDestroy() {
		this.valueChangeSubject.complete()
		this.valueChangeSubject.unsubscribe()
		this.subscriptions.unsubscribe()
	}

	setYearConstructionArray() {
		this.yearConstruction = [
			{ value: 1800 }, { value: 1900 }, { value: 1920 },
			{ value: 1940 }, { value: 1950 }, { value: 1960 },
			{ value: 1970 }, { value: 1980 }, { value: 1990 },
		]
		for (let year = 2000; year <= new Date().getFullYear(); year++) {
			this.yearConstruction.push({ value: year })
		}
	}

	initSliderOptions() {
		this.setYearConstructionArray()

		this.sliderOptions = {
			distance: {
				showTicksValues: false,
				stepsArray: [
					{ value: 1 },
					{ value: 2 },
					{ value: 5 },
					{ value: 10 },
					{ value: 15 },
					{ value: 20 },
					{ value: 25 },
					{ value: 30 },
					{ value: 50 },
					{ value: 75 },
					{ value: 100 }
				],
				translate: (value: number, label: LabelType): string => `< ${this.numberPipe.transform(value, '1.0-0', ' ')} km`
			},
			price: {
				showTicksValues: false,
				stepsArray: [
					{ value: 100000 }, { value: 200000 }, { value: 300000 }, { value: 400000 }, { value: 500000 }, { value: 600000 }, { value: 700000 }, { value: 800000 }, { value: 900000 },
					{ value: 1000000 }, { value: 1500000 }, { value: 2000000 }, { value: 3000000 }, { value: 4000000 }, { value: 5000000 }, { value: 7500000 },
					{ value: 10000000 }, { value: 20000000 }, { value: 50000000 }
				],
				translate: (value: number, label: LabelType): string => this.numberPipe.transform(value, '1.0-0', ' ', '$')
			},
			cashdown: {
				showTicksValues: false,
				stepsArray: [
					{ value: 10000 }, { value: 15000 }, { value: 20000 }, { value: 25000 }, { value: 30000 }, { value: 35000 }, { value: 40000 }, { value: 45000 }, { value: 50000 },
					{ value: 60000 }, { value: 70000 }, { value: 80000 }, { value: 90000 },
					{ value: 100000 }, { value: 150000 }, { value: 200000 }, { value: 250000 }, { value: 300000 }, { value: 350000 }, { value: 400000 }, { value: 450000 }, { value: 500000 },
					{ value: 550000 }, { value: 600000 }, { value: 650000 }, { value: 700000 }, { value: 750000 }, { value: 800000 }, { value: 850000 }, { value: 900000 }, { value: 950000 },
					{ value: 1000000 }, { value: 1250000 }, { value: 1500000 }, { value: 1750000 }, { value: 2000000 }, { value: 2250000 }, { value: 2500000 }, { value: 2750000 }, { value: 3000000 }, { value: 3500000 }, { value: 4000000 }, { value: 4500000 },
					{ value: 5000000 }, { value: 6000000 }, { value: 7500000 }, { value: 10000000 }
				],
				translate: (value: number, label: LabelType): string => this.numberPipe.transform(value, '1.0-0', ' ', '$')
			},
			units: {
				showTicksValues: false,
				stepsArray: [
					{ value: 5 },
					{ value: 6 },
					{ value: 7 },
					{ value: 8 },
					{ value: 9 },
					{ value: 10 },
					{ value: 12 },
					{ value: 15 },
					{ value: 20 },
					{ value: 24 },
					{ value: 30 },
					{ value: 50 },
					{ value: 100 },
					{ value: 200 },
				],
				translate: (value: number, label: LabelType): string => this.numberPipe.transform(value, '1.0-0', ' ')
			},
			yearOfConstruction: {
				showTicksValues: false,
				stepsArray: this.yearConstruction
			},
			publishDays: {
				showTicksValues: false,
				stepsArray: [
					{ value: 0 },
					{ value: 7 },
					{ value: 14 },
					{ value: 30 },
					{ value: 45 },
					{ value: 60 },
					{ value: 90 },
					{ value: 180 },
					{ value: 360 },
				],
				translate: (value: number, label: LabelType): string => ` ${this.numberPipe.transform(value, '1.0-0', ' ')} `
			},
		}
	}

	onCriteriaValueChange() {
		console.info('[Filter Pad] Criteria changed: ', this.filterCriteria)
		this.isLoading = true
		this.subscriptions.add(
			this.middleware.getFilteredPropertiesCount(this.filterCriteria).subscribe(res => {
				this.totalCount = res.toString()
				this.isLoading = false
			})
		)
		
	}

	async clearAll() {
		this.middleware.resetFilters()
		this.middleware.resetMapCriteria()
		this.address = ''
		this.filterCriteria = this.middleware.getCurrentFilterCriteria()
	}

	onUpdatePlace(res: any) {
		this.filterCriteria.coordinates = res.coordinates.coordinates
		this.filterCriteria.bounds = null

		this.middleware.updateMarketLoadingState(true)
		this.middleware.setFilterCriteria(this.filterCriteria, { resizeMap: true })
	}

	toggleListingType(type: ListingType) {
		if (this.filterCriteria.criteria.listingType.includes(type)) {
			this.filterCriteria.criteria.listingType = this.filterCriteria.criteria.listingType.filter(t => t !== type)
		} else {
			this.filterCriteria.criteria.listingType.push(type)
		}

		this.onCriteriaValueChange()
	}

	showListings() {
		this.middleware.setFilterCriteria(this.filterCriteria)
		this.middleware.saveFilterCriteria()
		this.modalRef.closeModal()
	}

	toggleAcceptingOffer() {
		this.filterCriteria.criteria.acceptOffers = !this.filterCriteria.criteria.acceptOffers
		this.onCriteriaValueChange()
	}

	toggleNotAcceptingOffer(value: boolean) {
		this.filterCriteria.criteria.notAcceptOffers = !this.filterCriteria.criteria.notAcceptOffers
		this.onCriteriaValueChange()
	}

	getSearchCount() {
		this.isLoading = true
		this.subscriptions.add(
			this.middleware.totalCountObservable.subscribe(res => {
				this.totalCount = res
				this.isLoading = false
			}, err => {
				this.isLoading = false
			})
		)
		
	}

}
