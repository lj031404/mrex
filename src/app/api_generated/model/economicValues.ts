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

export interface EconomicValues { 
    financingCompany?: FinancingCompany;
    qualificationRate?: number;
    /**
     * Real Interest rate. Not used in the calculation. This attribute is here for ease of data manipulation.
     */
    interestRate?: number;
    /**
     * Mortgage term. Not used in calculation. This attribute is here for ease of data manipulation.
     */
    term?: number;
    LTV?: number;
    DCR?: number;
    amortization?: number;
    /**
     * yearly management cost per each unit
     */
    yearlyMaintenancePerUnit?: number;
    /**
     * yearly salaries per each unit
     */
    yearlySalariesPerUnit?: number;
    vacancyRate?: number;
    managementRate?: number;
}