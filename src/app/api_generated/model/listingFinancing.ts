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
import { ListingFinancingItem } from './listingFinancingItem';

/**
 * details of financing
 */
export interface ListingFinancing { 
    estimatedEconomicValue?: Array<ListingFinancingItem>;
    maximumMortgage?: Array<ListingFinancingItem>;
    cashdown?: Array<ListingFinancingItem>;
    requiredFinancing?: Array<ListingFinancingItem>;
    monthlyPayment?: Array<ListingFinancingItem>;
}