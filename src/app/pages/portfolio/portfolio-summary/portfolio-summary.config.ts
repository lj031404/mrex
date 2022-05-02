import { UpcomingRefinance } from '@app/api_generated/model/upcomingRefinance'
import { PortfolioPropertyShort } from '@app/api_generated/model/portfolioPropertyShort'

export class PortfolioSummaryConfig {
	buildings?: number
	units?: number
	portfolio: Array<{
		value: number
		type: string
	}>
	chartInputDataList: ChartInputData[] = []
	upcomingRefinances: UpcomingRefinance[] = []
	properties: PortfolioPropertyShort[] = []

	constructor(summary?: PortfolioSummaryConfig) {
		if (summary) {
			this.buildings = summary.buildings
			this.units = summary.units
			this.portfolio = summary.portfolio
			this.chartInputDataList = summary.chartInputDataList
			this.upcomingRefinances = summary.upcomingRefinances
			this.properties = summary.properties
		} else { 
			this.buildings = 0
			this.units = 0
			this.portfolio = []
			this.chartInputDataList = null
			this.upcomingRefinances = []
			this.portfolio = []
		}
	}
}

export interface ChartInputData {
	label: string
	value: number
	showData?: boolean,
	chartType?: string,
	meterInfo?: any,
	chartData: {
		id: string
		title?: string
		isShowBeta?: boolean,
		valueUnit: string,
		graphData: Array<{
			year?: string,
			value: number,
			title?: string,
			color?: string,
			lineTop?: any,
			lineDown?: any
		}>
	}
}