import { Component, OnInit, EventEmitter } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ListingActivityFeed, ListingActivityFeedIconEnum } from '@app/core/models/listing-item.interface'
import { PropertyAddressPipe } from '@app-pipes/property-address.pipe'

import { PortfolioService as ApiPortfolioService } from '@app/api_generated/api/portfolio.service'
import { ActivatedRoute, Router } from '@angular/router'
import { switchMap, take } from 'rxjs/operators'

import { PortfolioPropertySummary } from '@app/api_generated/model/portfolioPropertySummary'
import * as moment from 'moment'
import { SpinnerService } from '@app/shared/services/spinner.service'
import { ReceiveOfferStatusType, Portfolio } from '@app-models/portfolio.interface'
import { LocalPortfolioProperty } from './portfolio-property'
import { PromptService } from '@app/shared/services/prompt.service'
import { PromptChoice } from '@app/core/models/prompt-choice.interface'
import { BehaviorSubject, of } from 'rxjs'
import { RouterMap } from '@app/core/utils/router-map.util'
import { CalculatorService } from '@app/shared/services/calculator.service'
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service'
import { ModalRef } from '@app/core/models/modal-ref'
import { LayoutService } from '@app/layout/service/layout.service'
import { PropertyAddComponent } from '@app/helper/property-add/property-add.component'
import { PropertyFormConfig } from '@app/helper/property-form-config'
import { PropertyLocalData } from '@app/core/models/property.interface'
import { PortfolioLocalService } from '@app/core/localDB/portfolio.service';
import { PortfolioFeedType } from '@app/api_generated/model/portfolioFeedType'
import { ListingDoc } from '@app/core/localDB/listings.service'

@Component({
	selector: 'app-portfolio-property',
	templateUrl: './portfolio-property.component.html',
	styleUrls: ['./portfolio-property.component.scss']
})
export class PortfolioPropertyComponent implements OnInit {
	feed: ListingActivityFeed[] = []
	feed$: BehaviorSubject<ListingActivityFeed[]> = new BehaviorSubject([])
	listing: ListingDoc
	modalRef: ModalRef
	modalComplete = new EventEmitter<any>()
	config: PropertyFormConfig
	masterModelDoc: PropertyLocalData
	PortfolioMap = RouterMap.Portfolio

	portfolioId: string
	portfolioProperty: LocalPortfolioProperty;
	ReceivePurchaseToOfferTypes = ReceiveOfferStatusType
	ReceivePurchaseToOfferKeys = Object.keys(ReceiveOfferStatusType)

	addressLine1: string
	addressLine2: string

	boxes = [
		{
			icon: 'assets/icons/home.svg',
			label: this.translate.instant('page.portfolio.portfolio-property.listing'),
			onClick: this.onPropertyClick.bind(this),
			disabled: false
		},
		{
			icon: 'assets/icons/calculator.png',
			label: this.translate.instant('page.portfolio.portfolio-property.calculator'),
			onClick: this.calculatorClick.bind(this),
			disabled: false
		},
		{
			icon: 'assets/icons/vector.png',
			label: this.translate.instant('page.portfolio.portfolio-property.models'),
			onClick: this.modelsClick.bind(this),
			disabled: false
		}
	]
	emptyProps = ['', '', '', '']
	constructor(
		private translate: TranslateService,
		private apiPortfolioService: ApiPortfolioService,
		private route: ActivatedRoute,
		private spinnerService: SpinnerService,
		private promptService: PromptService,
		private router: Router,
		private calculatorService: CalculatorService,
		private middleware: MarketMiddlewareService,
		private layoutService: LayoutService,
		public portfolioLocalService: PortfolioLocalService
	) {
		this.portfolioId = this.route.snapshot.params['id']
	}

	async ngOnInit() {
		await this.getPortfolioPropertySummary()
		await this.getPortfolioProperty()

		if (this.listing) {
			this.config = await this.calculatorService.getConfigFromListing(this.listing)
		}
		this.masterModelDoc = await this.calculatorService.getMasterModel(this.portfolioProperty.propertyId)
		this.boxes[2].disabled = !this.masterModelDoc // models box is disabled when there is no master model
	}

	onPropertyClick() {
		this.router.navigate([ RouterMap.Market.url([ RouterMap.Market.PROPERTIES, this.portfolioProperty.propertyId ]) ])
	}

	async calculatorClick() {
		if (this.listing) {

			const choices = [
				{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn btn-outline-green' },
				{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
			]
			const res = await this.promptService.prompt('', this.translate.instant('page.portfolio.gotoToCalculatorPrompt.text'), choices).toPromise()

			if (res === 'yes') {
				this.modalRef = this.layoutService.openModal(PropertyAddComponent, {
					config: this.config,
					complete: this.modalComplete
				}, false)
			}
		}
	}

	modelsClick() {
		if (this.masterModelDoc) {
			this.router.navigate([
				RouterMap.Watchlist.url([ this.portfolioProperty.propertyId, RouterMap.Watchlist.MODELING ])])
		}
		else {
			const message = this.translate.instant('page.watchlist.property-activity')
			const promptChoices: PromptChoice[] = [
				{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
			]
			this.promptService.prompt('', message, promptChoices).toPromise()
		}
	}

	async update() {
		const choices = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn btn-outline-green' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		const res = await this.promptService.prompt('', this.translate.instant('page.portfolio.portfolio-property.update.prompt'), choices).toPromise()

		if (res === 'yes') {
			setTimeout(() => {
				this.router.navigate([ this.PortfolioMap.url([ this.PortfolioMap.UPDATE, this.portfolioId ]) ])
			}, 500)
			
		}
		
	}

	async getPortfolioPropertySummary() {
		this.spinnerService.show()
		this.spinnerService.text=''

		try {
			const summary: PortfolioPropertySummary = await this.apiPortfolioService.getPortfolioPropertySummary(this.portfolioId).toPromise()

			const portfolio = Object.keys(summary.metrics).map(key => ({
				value: summary.metrics[key],
				type: key
			}))

			const chartInputDataList = Object.keys(summary.indicatorsTrends).map(key => ({
				label: `page.portfolio.portfolio-property.${key}`,
				value: summary.indicatorsTrends[key].value,
				showData: summary.indicatorsTrends[key].showData,
				chartData: this.buildChartData(summary.indicatorsTrends[key].historical, key)
			}))
			
			summary.feed
				.forEach(item => {
					let feed
					if (item.type === PortfolioFeedType.Purchase) {
						feed = {
							icon: ListingActivityFeedIconEnum.Home,
							text: this.translate.instant(`page.portfolio.portfolio-property.feed.${item.type}`, {
								price: this.shortNumber(item.data.price)
							}),
							feedDate: new Date(item.date).getTime(),
							linkUrl: this.PortfolioMap.url([ this.PortfolioMap.EDIT, this.portfolioId ]),
							linkLabel: this.translate.instant('shared.components.ListingActivityFeed.editPortfolio')
						}
					}
					else if (item.type === PortfolioFeedType.Edit) {
						feed = {
							icon: ListingActivityFeedIconEnum.Home,
							text: this.translate.instant(`page.portfolio.portfolio-property.feed.${item.type}`, {
								price: this.shortNumber(item.data.price)
							}),
							feedDate: new Date(item.date).getTime(),
							linkUrl: this.PortfolioMap.url([ this.PortfolioMap.EDIT, this.portfolioId ]),
							linkLabel: this.translate.instant('shared.components.ListingActivityFeed.editPortfolio')
						}
					}
					else if (item.type === PortfolioFeedType.Sold) {
						try{
							feed = {
								icon: ListingActivityFeedIconEnum.Price,
								text: this.translate.instant(`page.portfolio.portfolio-property.feed.${item.type}`, {
									price: this.shortNumber(item.data.price)
								}),
								feedDate: new Date(item.date).getTime(),
								linkUrl: null,
								linkLabel: null
							}
						}
						catch(err) {
							console.error(err)
						}
					}
					else if (item.type === PortfolioFeedType.Refinance) {
						feed = {
							icon: ListingActivityFeedIconEnum.Price,
							text: this.translate.instant(`page.portfolio.portfolio-property.feed.${item.type}`, {
								price: this.shortNumber(item.data.price)
							}),
							feedDate: new Date(item.date).getTime(),
							linkUrl: this.PortfolioMap.url([ this.PortfolioMap.EDIT, this.portfolioId ]),
							linkLabel: this.translate.instant('shared.components.ListingActivityFeed.editPortfolio')
						}
					}

					this.feed.push(feed)		
					
					this.feed$.next(this.feed)
					
				})

			this.portfolioProperty = {
				...summary,
				portfolio,
				chartInputDataList
			}

			if (this.portfolioProperty.listingId) {
				this.listing = await this.middleware.getListing(this.portfolioProperty.listingId)
			}

			const propertyAddressPipe = new PropertyAddressPipe()

			this.addressLine1 = propertyAddressPipe.transform(this.listing.address, 'first')
			this.addressLine2 = propertyAddressPipe.transform(this.listing.address, 'second')

			this.spinnerService.hide()
		}
		catch (err) {
			this.spinnerService.hide()
		}

	}

	buildChartData(data: Array<{
		year?: string,
		value?: number,
		date?: Date,
		stdDev?: number,
		real?: boolean
	}>, id: string) {
		return {
			id,
			title: '',
			isShowBeta: false,
			valueUnit: this.getChartUnit(id),
			graphData: data.filter(item => item.value !== null).map(item => ({
				lineTop: item.value + item.stdDev,
				lineDown: item.value - item.stdDev,
				value: item.value,
				year: moment.utc(item.date).format('MM/DD/YY')
			}))
		}
	}

	getChartUnit(type: string) {
		if (type === 'overallValue') {
			return '$'
		} else if (type === 'remainingPrincipal') {
			return '$'
		} else if (type === 'netValue') {
			return '$'
		} else if (type === 'appreciation') {
			return '$'
		} else if (type === 'annualizedAppreciation') {
			return '%'
		} else if (type === 'ltv') {
			return '%'
		} else if (type === 'dsr') {
			return ''
		} else if (type === 'equity') {
			return '$'
		} else {
			return ''
		}
	}

	removePortfolio() {
		const message = this.translate.instant('page.portfolio.portfolio_remove')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		this.promptService.prompt('', message, promptChoices)
			.pipe(
				take(1),
				switchMap((res) => {
					if (res === 'yes') {
						this.spinnerService.show()
						this.spinnerService.text=''

						return this.apiPortfolioService.deletePortfolioProperty(this.portfolioId)
					} else {
						return of([])
					}
				})
			)
			.subscribe((res) => {
				this.spinnerService.hide()
				if (!res) {
					this.router.navigateByUrl('/portfolio/summary')
				}
			}, () => {
				this.spinnerService.hide()
			})

	}

	navigateToSummaryScreen = () => {
		this.router.navigate(['/portfolio/summary'])
	}

	updateStatus() {
		this.spinnerService.show()
		this.spinnerService.text=''
		
		this.apiPortfolioService.updateOfferStatus({
			receiveOfferStatus: this.portfolioProperty.status
		}, this.portfolioId).subscribe(
			res => {
				this.spinnerService.hide()
			}, err => {
				this.spinnerService.hide()
			}
		)
	}

	async getPortfolioProperty() {
		this.portfolioLocalService.portfolioPropertyDetailData = await this.apiPortfolioService.getPortfolioProperty(this.portfolioId)
			.toPromise()
			.catch((err) => {
				console.error(err)
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 3000, 'error', false)
			}) as Portfolio

	}

	shortNumber(value: any, args?: any) {
		let exp
		const suffixes = ['M', 'G', 'T', 'P', 'E']

		if (Number.isNaN(value)) {
			return null
		}

		if (!value) {
			return 0
		}

		if (value < 10000000) {
			return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		}

		exp = Math.floor(Math.log(value) / Math.log(1000000))

		return (value / Math.pow(1000000, exp)).toFixed(args) + suffixes[exp - 1]
	}

}
