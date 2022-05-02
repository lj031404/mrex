import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { PropertiesService } from '@app/core/localDB/properties.service'
import { RouterMap } from '@app/core/utils/router-map.util'
import { PortfolioSummaryConfig } from './portfolio-summary.config'
import * as moment from 'moment'
import * as _ from 'lodash';
import { SpinnerService } from '@app/shared/services/spinner.service'
import { ListingActivityFeedIconEnum, ListingActivityFeed } from '@app/core/models/listing-item.interface'
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service'
import { UnregisteredProperty } from '@app/api_generated/model/unregisteredProperty'
import { PropertyPendingService } from '@app-services/property-pending.service'
import { PortfolioLocalService } from '@app/core/localDB/portfolio.service'
import { BehaviorSubject, Subscription } from 'rxjs'
import { PortfolioService as PortfolioApiService } from '@app/api_generated/api/portfolio.service'
import { LayoutService } from '@app/layout/service/layout.service'
import { ChartTypes } from '@app-core/models/chartType.enum';
import { GlobalService } from '@app/core/services/global.service'
import { PortfolioPropertyAction } from '@app-models/portfolioEvent.enum';
import { PromptChoice } from '@app/core/models/prompt-choice.interface'
import { PromptService } from '@app/shared/services/prompt.service';
import { switchMap } from 'rxjs/operators'
@Component({
	selector: 'app-portfolio-summary',
	templateUrl: './portfolio-summary.component.html',
	styleUrls: ['./portfolio-summary.component.scss']
})
export class PortfolioSummaryComponent implements OnInit, OnDestroy {
	isLoading: boolean
	portfolioSummary: PortfolioSummaryConfig = new PortfolioSummaryConfig()
	countModels = {}
	pendingProperties: Array<any>
	portfolioImages: Array<string> = []
	feed: ListingActivityFeed[] = []
	feed$: BehaviorSubject<ListingActivityFeed[]> = new BehaviorSubject([])
	draftProperties: Array<any>
	sub: Subscription = new Subscription()
	emptyProps = ['', '', '', '']
	ChartTypes = ChartTypes
	constructor(
		private router: Router,
		private translate: TranslateService,
		public spinnerService: SpinnerService,
		private settingsMiddleware: UserSettingsMiddlewareService,
		private propertiesService: PropertiesService,
		private propertyPendingService: PropertyPendingService,
		private portfolioLocalService: PortfolioLocalService,
		private portfolioApiService: PortfolioApiService,
		private layoutService: LayoutService,
		public globalService: GlobalService,
		private promptService: PromptService,
	) { }

	ngOnInit() {
		this.getPortfolioSummaryData()
		this.sub.add(
			this.propertyPendingService.pendingPropertyEvent.subscribe(async (res) => {
				this.pendingProperties = await this.portfolioLocalService.getPortfolioPendingPortfolios(true)
			})
		)
	}

	navigateToProperties(portfolioId: string) {
		this.router.navigate([
			RouterMap.Portfolio.url([RouterMap.Portfolio.PROPERTIES, portfolioId])
		])
	}

	navigateToEditProperties(draft) {
		this.router.navigate([
			RouterMap.Portfolio.url([RouterMap.Portfolio.UPDATE, draft.id])
		])
	}

	async getPortfolioSummaryData(fetchApi = false) {
		this.spinnerService.text = this.translate.instant('spinner.loadingPortfolio')
		this.spinnerService.show()

		try {
			const res = await this.portfolioLocalService.getPortfolioSummary(fetchApi)
			this.pendingProperties = await this.portfolioLocalService.getPortfolioPendingPortfolios(fetchApi)
			const draftProperties = await this.portfolioLocalService.getPortfolioDraftPros(fetchApi)
			this.draftProperties = draftProperties.map((draft: any) => ({
				...draft,
				draftId: draft.id
			}))
			this.draftProperties = _.sortBy(this.draftProperties, 'createdAt')

			this.spinnerService.hide()
			if (res) {
				this.portfolioSummary.buildings = res.buildings
				this.portfolioSummary.units = res.units
				this.portfolioSummary.portfolio = Object.keys(res.metrics).map(key => ({
					value: res.metrics[key],
					type: key
				}))

				if (!this.pendingProperties.length && !this.draftProperties.length && !this.portfolioSummary.buildings && !this.portfolioSummary.units) {
					this.globalService.sendPortfolioEvent(PortfolioPropertyAction.HideDrawerBtn)
				} else {
					this.globalService.sendPortfolioEvent(PortfolioPropertyAction.ShowDrawerBtn)
				}

				this.portfolioSummary.chartInputDataList = Object.keys(res.indicatorsTrends).map(key => ({
					label: `page.portfolio.summary.${key}`,
					value: res.indicatorsTrends[key].value,
					showData: res.indicatorsTrends[key].showData,
					chartType: ChartTypes.FILL_BETWEEN_LINES,
					meterInfo: null,
					progressBar: null,
					chartData: this.buildChartData( res.indicatorsTrends[key].historical, key)
				}))
				// Mock data for new portfolio summary
				// .concat(
				// 	{
				// 		label: 'pages.portfolio.portfolio_summary.year',
				// 		value: null,
				// 		showData: true,
				// 		chartData: this.buildPieChartData(),
				// 		chartType: ChartTypes.PIE,
				// 		progressBar: null,
				// 		meterInfo: null,
				// 	}, {
				// 		label: 'pages.portfolio.portfolio_summary.month',
				// 		value: null,
				// 		showData: true,
				// 		chartData: this.buildPieChartData(),
				// 		chartType: ChartTypes.PIE,
				// 		meterInfo: null,
				// 		progressBar: null
				// 	}, {
				// 		label: 'pages.portfolio.portfolio_summary.expense_ratio',
				// 		value: null,
				// 		showData: true,
				// 		chartData: null,
				// 		progressBar: null,
				// 		meterInfo: {
				// 			low: 1000,
				// 			media: 2000,
				// 			high: 3000,
				// 			value: 2700,
				// 			units: '$',
				// 			labels: ['Low', 'Median', 'High']
				// 		},
				// 		chartType: ChartTypes.METER
				// 	}, {
				// 		label: 'pages.portfolio.portfolio_summary.dsr_ratio',
				// 		value: null,
				// 		showData: true,
				// 		chartData: null,
				// 		meterInfo: {
				// 			low: 1000,
				// 			media: 2000,
				// 			high: 3000,
				// 			value: 2700,
				// 			units: '$',
				// 			labels: ['Low', 'Median', 'High']
				// 		},
				// 		progressBar: null,
				// 		chartType: ChartTypes.METER
				// 	}, {
				// 		label: 'pages.portfolio.portfolio_summary.lorem_lpsum',
				// 		value: null,
				// 		showData: true,
				// 		chartData: null,
				// 		progressBar: [{
				// 				title: 'Estimated Value',
				// 				total: 3000000,
				// 				value: 2000000
				// 			},
				// 			{
				// 				title: 'Economic Value',
				// 				total: 3000000,
				// 				value: 1800000
				// 			},
				// 			{
				// 				title: 'Current mortgage',
				// 				total: 3000000,
				// 				value: 1500000
				// 			}
				// 		],
				// 		chartType: ChartTypes.PROGRESS_BAR_GROUP,
				// 		meterInfo: null,
				// 	}, {
				// 		label: 'pages.portfolio.portfolio_summary.ltv',
				// 		value: null,
				// 		showData: true,
				// 		chartData: null,
				// 		progressBar: null,
				// 		meterInfo: {
				// 			low: 1000,
				// 			media: 2000,
				// 			high: 3000,
				// 			value: 2700,
				// 			units: '$',
				// 			labels: ['Low', 'Median', 'High']
				// 		},
				// 		chartType: ChartTypes.METER
				// 	}
				// )
				
				this.portfolioSummary.upcomingRefinances = res.upcomingRefinances.map(item => ({
					...item,
					icon: ListingActivityFeedIconEnum.Home
				}))
				this.portfolioSummary.properties = res.properties
				const properties = res.properties

				const models = this.propertiesService.listPropertiesAndModels()

				properties.forEach(property => {
					this.countModels[property.propertyId] = models.filter(x => x.propertyData.inheritedFrom === property.propertyId || x.propertyData.parent === property.propertyId).length
				})

				if (this.portfolioSummary.properties && this.portfolioSummary.properties.length) {
					this.portfolioImages = this.portfolioSummary.properties.map(property => property.imageUrl).splice(0, 8)
				}

				this.portfolioSummary.upcomingRefinances.forEach(refinancing => {
					this.feed.push({
						icon: ListingActivityFeedIconEnum.Price,
						text: refinancing.address,
						feedDate: new Date(refinancing.date).getTime(),
						linkUrl: null,
						linkLabel: null
					})
				})

				this.feed$.next(this.feed)
			}
		}
		catch(err) {
			console.error(err)
			this.spinnerService.hide()
		}
	}

	buildChartData(data: Array<{
		year?: string,
		stdDev?: number,
		value?: number,
		date?: Date,
		real?: boolean
	}>, id: string) {
		moment.locale(this.settingsMiddleware.languageCode)
		return {
			id,
			title: '',
			isShowBeta: false,
			valueUnit: this.getChartUnit(id),
			graphData:  data.map(item => ({
				lineTop: item.value + item.stdDev,
				lineDown: item.value - item.stdDev,
				value: item.value,
				year: moment.utc(item.date).format('MM/DD/YY')
			}))
		}
	}

	buildPieChartData() {
		return {
			id: 'pieChart1',
			title: '',
			valueUnit: '$',
			isShowBeta: false,
			graphData: [{
				lineTop: null,
				lineDown: null,
				year: null,
				title: 'Gross income',
				value: 2300.84,
				color: '#5CB09F'
				}, {
				lineTop: null,
				lineDown: null,
				year: null,
				title: 'NOI ',
				value: 2500.84,
				color: '#36FAD1'
				}, {
				lineTop: null,
				lineDown: null,
				year: null,
				title: 'Mortgage payment',
				value: 2100.84,
				color: '#024134'
				}, {
				lineTop: null,
				lineDown: null,
				year: null,
				title: 'Cash flow',
				value: 4100.84,
				color: '#227967'
			}]
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

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

	async onDeletePortfolioProp(deletedItem) {
		this.portfolioSummary.properties = this.portfolioSummary.properties.filter(prop => prop.portfolioId !== deletedItem.portfolioId)
		this.draftProperties = this.draftProperties.filter(draft => draft.draftId !== deletedItem.draftId)
		this.pendingProperties = this.pendingProperties.filter(prop => prop.portfolioId !== deletedItem.portfolioId)

		// Delete portfolio prop
		if (deletedItem.portfolioId) {
			await this.portfolioApiService.deletePortfolioProperty(deletedItem.portfolioId).toPromise()
		}

		if (deletedItem.draftId) {
			await this.portfolioApiService.deletePortfolioProperty(deletedItem.draftId).toPromise()
		}
		
		this.layoutService.openSnackBar('page.watchlist.property-overview.removedConfirmation', null, 3000, 'info', false)

		this.getPortfolioSummaryData(true)

	}


	openSearchDrawer() {
		this.globalService.sendPortfolioEvent(PortfolioPropertyAction.OpenDrawer)
	}

	async onDeletePendingPortfolioProp(item) {
		const message = this.translate.instant('pages.watchlist.delete_property_message')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		const res = await this.promptService.prompt('', message, promptChoices).toPromise()
		if (res === 'yes') {
			this.spinnerService.show()
			this.spinnerService.text = ''
			this.portfolioApiService.deletePendingPortfolio(item.id).pipe(
				switchMap(() => this.portfolioLocalService.getPortfolioPendingPortfolios(true))
				
			).subscribe((pendingProps) => {
				this.pendingProperties = pendingProps;
				this.spinnerService.hide()
			}, err => {
				this.spinnerService.hide()
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			} )
		}
	}
}
