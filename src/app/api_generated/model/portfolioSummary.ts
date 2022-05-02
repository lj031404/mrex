/**
 * MREX property schema
 * This is the MREX schema for a property
 *
 * OpenAPI spec version: 1.0.0
 * Contact: jlavoie@mrex.co
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { PortfolioPropertyShort } from './portfolioPropertyShort';
import { PortfolioSummaryIndicatorsTrends } from './portfolioSummaryIndicatorsTrends';
import { PortfolioSummaryMetrics } from './portfolioSummaryMetrics';
import { UpcomingRefinance } from './upcomingRefinance';

export interface PortfolioSummary { 
    buildings?: number;
    units?: number;
    metrics?: PortfolioSummaryMetrics;
    indicatorsTrends?: PortfolioSummaryIndicatorsTrends;
    upcomingRefinances?: Array<UpcomingRefinance>;
    properties?: Array<PortfolioPropertyShort>;
}