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
import { ListingRowValue } from './listingRowValue';

/**
 * details of acquisition costs
 */
export interface ListingAcquisitionCosts { 
    cashdown?: ListingRowValue;
    mortgage?: ListingRowValue;
    acquisitionFees?: ListingRowValue;
    salePrice?: ListingRowValue;
    acquisitionCost?: ListingRowValue;
}