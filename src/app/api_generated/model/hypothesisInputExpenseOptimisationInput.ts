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
import { OptimisationExpensesInput } from './optimisationExpensesInput';

/**
 * The inputs for any of the following keys are included here. For each key that the user intends to fetch the input, he should provide all the inputs for the months of project duration. For instance, if the project duration is 30 years and the user intends to fetch the input for otherExpenses, he should fetch an array of 30*12=360 elements
 */
export interface HypothesisInputExpenseOptimisationInput { 
    municipalTaxes?: OptimisationExpensesInput;
    schoolTaxes?: OptimisationExpensesInput;
    insurance?: OptimisationExpensesInput;
    electricity?: OptimisationExpensesInput;
    naturalGas?: OptimisationExpensesInput;
    otherExpenses?: OptimisationExpensesInput;
}