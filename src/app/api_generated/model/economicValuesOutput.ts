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
import { FinancingCompany } from './financingCompany';

export interface EconomicValuesOutput { 
    financingCompany?: FinancingCompany;
    effectiveGrossIncome?: number;
    qualificationRate?: number;
    economicValue?: number;
    maximumLoanDollars?: number;
    downPayment?: number;
    acquisitionCosts?: number;
    totalAcquisitionCost?: number;
    downPaymentAmount?: number;
    management?: number;
    netOperatingIncome?: number;
    mortgagePayment?: number;
    debtServiceRatio?: number;
    mortgageInsuranceRate?: number;
    mortgageInsuranceAmount?: number;
    financingNRM?: number;
    financingCapRate?: number;
    askingCapRate?: number;
    normalizedExpenses?: number;
    leverageNRM?: number;
    leverageCapRate?: number;
    projectDuration?: number;
    normalizedExpensesBreakdown?: any;
    loanAmount?: number;
}