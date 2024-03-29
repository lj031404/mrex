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
import { ListingType } from './listingType';
import { PropertyType } from './propertyType';

export interface SearchCriteriaProperty { 
    /**
     * Cashdown range needed to buy the property
     */
    cashdown?: Array<number>;
    /**
     * Price range
     */
    price?: Array<number>;
    /**
     * Range for number of units
     */
    residentialUnits?: Array<number>;
    /**
     * Range of year of construction
     */
    yearOfConstruction?: Array<number>;
    listingType?: ListingType;
    acceptOffers?: boolean;
    propertyType?: PropertyType;
}