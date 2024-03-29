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

/**
 * financing company related parameters used in calculation
 */
export type FinancingCompany = 'CHMC' | 'ConventionalCustom' | 'BNC' | 'Desjardins' | 'RBC';

export const FinancingCompany = {
    CHMC: 'CHMC' as FinancingCompany,
    ConventionalCustom: 'ConventionalCustom' as FinancingCompany,
    BNC: 'BNC' as FinancingCompany,
    Desjardins: 'Desjardins' as FinancingCompany,
    RBC: 'RBC' as FinancingCompany
};