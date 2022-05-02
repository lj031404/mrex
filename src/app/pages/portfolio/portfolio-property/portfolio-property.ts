import { PortfolioPropertySummary } from '@app/api_generated/model/portfolioPropertySummary';
import { ChartInputData } from '../portfolio-summary/portfolio-summary.config';

export interface LocalPortfolioProperty extends PortfolioPropertySummary {
	portfolio?: Array<{
		value: number,
		type: string
	}>
	chartInputDataList?: Array<ChartInputData>

}