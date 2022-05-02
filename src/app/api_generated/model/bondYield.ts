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
import { BondYieldCmb } from './bondYieldCmb';

/**
 * bond yield
 */
export interface BondYield { 
    bondType?: BondYield.BondTypeEnum;
    cmb?: BondYieldCmb;
    goc?: BondYieldCmb;
}
export namespace BondYield {
    export type BondTypeEnum = '2years' | '3years' | '5years' | '7years' | '10years' | 'Long';
    export const BondTypeEnum = {
        _2years: '2years' as BondTypeEnum,
        _3years: '3years' as BondTypeEnum,
        _5years: '5years' as BondTypeEnum,
        _7years: '7years' as BondTypeEnum,
        _10years: '10years' as BondTypeEnum,
        Long: 'Long' as BondTypeEnum
    };
}