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
import { HypothesisOutputEvProjectionValues } from './hypothesisOutputEvProjectionValues';

export interface HypothesisOutputEvProjection { 
    financingCompany?: HypothesisOutputEvProjection.FinancingCompanyEnum;
    evProjectionValues?: Array<HypothesisOutputEvProjectionValues>;
}
export namespace HypothesisOutputEvProjection {
    export type FinancingCompanyEnum = 'CHMC' | 'ConventionalCustom' | 'BNC' | 'Desjardins' | 'RBC';
    export const FinancingCompanyEnum = {
        CHMC: 'CHMC' as FinancingCompanyEnum,
        ConventionalCustom: 'ConventionalCustom' as FinancingCompanyEnum,
        BNC: 'BNC' as FinancingCompanyEnum,
        Desjardins: 'Desjardins' as FinancingCompanyEnum,
        RBC: 'RBC' as FinancingCompanyEnum
    };
}