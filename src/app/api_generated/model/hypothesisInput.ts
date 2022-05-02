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
import { EconomicValues } from './economicValues';
import { FinancingCompany } from './financingCompany';
import { HypothesisInputExpenseOptimisationInput } from './hypothesisInputExpenseOptimisationInput';
import { RefinancingEconomicValues } from './refinancingEconomicValues';
import { RefinancingInputs } from './refinancingInputs';
import { SecondaryFinancing } from './secondaryFinancing';

export interface HypothesisInput { 
    /**
     * The property associated to the hypothesis
     */
    propertyId?: string;
    /**
     * Timestamp at which the hypothesis was created
     */
    createdAt?: Date;
    /**
     * Timestamp at which the hypothesis was last updated
     */
    updatedAt?: Date;
    /**
     * Qualification rate used for each term
     */
    termsInterestRates: Array<number>;
    rentMethod: HypothesisInput.RentMethodEnum;
    /**
     * Amount paid for buying a property
     */
    askPrice?: number;
    /**
     * number of units in calculation model
     */
    numberOfUnits: number;
    /**
     * municipal taxes
     */
    municipalTaxes: number;
    /**
     * schoolTaxes tax
     */
    schoolTaxes: number;
    /**
     * municipalTaxes + schoolTaxes
     */
    totalTaxes?: number;
    /**
     * insurance
     */
    insurance: number;
    /**
     * electricity
     */
    electricity: number;
    /**
     * naturalGas
     */
    naturalGas: number;
    /**
     * sum of all utilities
     */
    totalUtilities?: number;
    otherExpenses: number;
    landscaping: number;
    yearlyMaintenancePerUnit: number;
    yearlySalariesPerUnit: number;
    thirdMethodCurrentGrossIncome?: number;
    vacancyRate: number;
    managementRate: number;
    stabilizedRentIncreaseRate?: number;
    /**
     * one dimensional of dwelling monthly rents used by method 1
     */
    monthlyRentsForFirstMethod?: Array<number>;
    /**
     * two dimensional array of dwelling monthly rents used by rent method 2 (60 rows * 24 columns)
     */
    monthlyRentsForSecondMethod?: Array<Array<number>>;
    /**
     * Yearly rent increase percentage for 6 consecutive years and  entry for years 6+
     */
    rentIncreaseRate: Array<number>;
    /**
     * array of objects each contains financial parameters calculated for one financing company
     */
    economicValues: Array<EconomicValues>;
    /**
     * two dimensional array that contains input financial parameters for different financing companies
     */
    refinancingEconomicValues: Array<RefinancingEconomicValues>;
    financingCompany: FinancingCompany;
    bank?: FinancingCompany;
    isInsured?: boolean;
    /**
     * one dimensional array of term durations ( lenght=10)
     */
    term: Array<number>;
    /**
     * two dimensional array of other debts calculation parameters ( 4 rows). Each row is specified at $ref
     */
    secondaryFinance?: Array<SecondaryFinancing>;
    /**
     * array of 3 objects each defines parameters of one refinancing strategy
     */
    refinance?: Array<RefinancingInputs>;
    expensesIncreaseRate?: number;
    capitalGainsTax?: number;
    personalIncomeTax?: number;
    commision?: number;
    landToBuildingRatio?: number;
    /**
     * number of buildings after refinancing
     */
    refinanceNumberOfUnits?: number;
    commission?: number;
    npvDiscountRate?: number;
    timingLiquidationYear?: number;
    propertyTransferTax?: number;
    notary?: number;
    financingAndEscrowFee?: number;
    /**
     * Sum of all acquisition costs (property transfer tax, notary, financing and escrow fee, building inspection and other costs)
     */
    totalAcquisitionCosts?: number;
    refinanceFee?: number;
    buildingInspection?: number;
    chmc?: number;
    otherAcquisitionCosts?: number;
    capRateYearOne?: number;
    capRateYearTwo?: number;
    capRateYearThreeAndUp?: number;
    reinvestmentRate?: number;
    /**
     * array of maintenance breakdowns for project duration (360). This array shows the monthly expenditure breakdowns. If the input array's length is less than 360, the api will fill the rest with zeros up to 360. This array shows the monthly expenditure breakdowns
     */
    monthlyMaintenanceBreakdown: Array<number>;
    /**
     * array of capital expenditure breakdown for project duration (360). This array shows the monthly capital expenditure breakdowns. If the input array's length is less than 360, the api will fill the rest with zeros up to 360.
     */
    monthlyCapitalExpendituresBreakdown: Array<number>;
    /**
     * Amortizing tax percentage for years 1-19 and 20+
     */
    taxAmortizationBenefitSchedule?: Array<number>;
    expenseProjectionMethod: HypothesisInput.ExpenseProjectionMethodEnum;
    /**
     * array of amortizing tax rates for years 1 to 20+
     */
    amortizingTax?: Array<number>;
    expenseOptimisationInput?: HypothesisInputExpenseOptimisationInput;
    /**
     * The user determines which column from preTaxNpv, preTaxIrr, preTaxMirr, postTaxNpv, postTaxIrr, postTaxMirr he needs to get the values. Each of preTaxNpv preTaxIrr, preTaxMirr, postTaxNpv, postTaxIrr, postTaxMirr is a vector of values for the liquidation timing which ranges from 1 to 300. So these arrays are all of size [1,300]. The user selects timing liquidation he needs( The column number ). For instance if he sends 25 for ProfitabilityNeededColumn, the values preTaxNpv[25], preTaxIrr[25], preTaxMirr[25], postTaxNpv[25], postTaxIrr[25], postTaxMirr[25] are returned in Profitability output.
     */
    profitabilityNeededColumn?: number;
}
export namespace HypothesisInput {
    export type RentMethodEnum = 1 | 2 | 3;
    export const RentMethodEnum = {
        NUMBER_1: 1 as RentMethodEnum,
        NUMBER_2: 2 as RentMethodEnum,
        NUMBER_3: 3 as RentMethodEnum
    };
    export type ExpenseProjectionMethodEnum = 1 | 2;
    export const ExpenseProjectionMethodEnum = {
        NUMBER_1: 1 as ExpenseProjectionMethodEnum,
        NUMBER_2: 2 as ExpenseProjectionMethodEnum
    };
}