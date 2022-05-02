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
import { CashFlowliquidation } from './cashFlowliquidation';
import { EconomicValuesOutput } from './economicValuesOutput';
import { ExpensesSummary } from './expensesSummary';
import { HypothesisOutputCashFlowEdit } from './hypothesisOutputCashFlowEdit';
import { HypothesisOutputEvProjection } from './hypothesisOutputEvProjection';
import { HypothesisOutputExpenses } from './hypothesisOutputExpenses';
import { HypothesisOutputFirstMortgageInterestRate } from './hypothesisOutputFirstMortgageInterestRate';
import { HypothesisOutputPropertyComparison } from './hypothesisOutputPropertyComparison';
import { HypothesisOutputPurchaseInfo } from './hypothesisOutputPurchaseInfo';
import { HypothesisOutputRefinanceParameters } from './hypothesisOutputRefinanceParameters';
import { HypothesisOutputSecondaryFinancingParameters } from './hypothesisOutputSecondaryFinancingParameters';
import { HypothesisOutputSummaryOverview } from './hypothesisOutputSummaryOverview';
import { IncomeSummary } from './incomeSummary';
import { LeverageSummary } from './leverageSummary';
import { Loan } from './loan';
import { MortgageLoan } from './mortgageLoan';
import { OperationalCashFlow } from './operationalCashFlow';
import { OptimisationExpenses } from './optimisationExpenses';
import { Profitability } from './profitability';
import { ProjectionChart } from './projectionChart';
import { Results } from './results';
import { SummaryCashOnCash } from './summaryCashOnCash';
import { Tax } from './tax';
import { TaxSummary } from './taxSummary';

export interface HypothesisOutput { 
    expenses?: HypothesisOutputExpenses;
    purchaseInfo?: HypothesisOutputPurchaseInfo;
    cashFlowEdit?: HypothesisOutputCashFlowEdit;
    /**
     * one dimensional array of average yearly rents calculated using yearly increasing percents
     */
    nextYearsAverageRent?: Array<number>;
    /**
     * two dimensional array of parameters typically calculated for 5 year durations
     */
    firstMortgageInterestRate?: Array<HypothesisOutputFirstMortgageInterestRate>;
    /**
     * array of objects. each object represents financial parameters calculated for a financing company
     */
    economicValues?: Array<EconomicValuesOutput>;
    /**
     * two dimensional array of other debt parameters
     */
    secondaryFinancingParameters?: Array<HypothesisOutputSecondaryFinancingParameters>;
    /**
     * two dimensional array of refinance parameters
     */
    refinanceParameters?: Array<HypothesisOutputRefinanceParameters>;
    firstMortgage?: Array<MortgageLoan>;
    /**
     * Array of objects
     */
    secondaryFinancingLoan1?: Array<Loan>;
    /**
     * Array of objects
     */
    secondaryFinancingLoan2?: Array<Loan>;
    /**
     * Array of objects
     */
    secondaryFinancingLoan3?: Array<Loan>;
    /**
     * Array of objects
     */
    secondaryFinancingLoan4?: Array<Loan>;
    /**
     * Array of objects
     */
    secondaryFinancingLoanSum?: Array<Loan>;
    /**
     * array of objects
     */
    refinanceLoan1?: Array<Loan>;
    /**
     * array of objects
     */
    refinanceLoan2?: Array<Loan>;
    /**
     * array of objects
     */
    refinanceLoan3?: Array<Loan>;
    /**
     * array of objects
     */
    refinanceLoanSum?: Array<Loan>;
    /**
     * two dimensional array.Rows illustrate project duration (1-30)
     */
    tax?: Array<Tax>;
    preTaxNPV?: Array<number>;
    preTaxIRR?: Array<number>;
    preTaxMIRR?: Array<number>;
    postTaxNPV?: Array<number>;
    postTaxIRR?: Array<number>;
    postTaxMIRR?: Array<number>;
    evProjection?: Array<HypothesisOutputEvProjection>;
    /**
     * component of projection table
     */
    operationalCashFlow?: Array<OperationalCashFlow>;
    results?: Array<Results>;
    /**
     * component of projection table
     */
    cashflowLiquidation?: Array<CashFlowliquidation>;
    incomeSummary?: Array<IncomeSummary>;
    leverageSummary?: Array<LeverageSummary>;
    taxSummary?: Array<TaxSummary>;
    expensesSummary?: Array<ExpensesSummary>;
    optimisationExpenses?: Array<OptimisationExpenses>;
    profitability?: Array<Profitability>;
    summaryCashOnCash?: Array<SummaryCashOnCash>;
    summaryOverview?: HypothesisOutputSummaryOverview;
    propertyComparison?: HypothesisOutputPropertyComparison;
    projectionsChart?: ProjectionChart;
}