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
import { ListingType } from './listingType';
import { MarketPropertyComparableDetailsBroker } from './marketPropertyComparableDetailsBroker';
import { MarketPropertyComparableDetailsBuyer } from './marketPropertyComparableDetailsBuyer';
import { MarketPropertyComparableDetailsSeller } from './marketPropertyComparableDetailsSeller';

export interface MarketPropertyComparableDetails { 
    comparableCapRates?: { [key: string]: any; };
    seller?: MarketPropertyComparableDetailsSeller;
    buyer?: MarketPropertyComparableDetailsBuyer;
    broker?: MarketPropertyComparableDetailsBroker;
    notary?: string;
    bank?: FinancingCompany;
    /**
     * Original asking price
     */
    originalPrice?: number;
    soldPrice?: number;
    listingType?: ListingType;
    /**
     * Publish date at which the listing was published
     */
    publishDate?: Date;
    /**
     * Date at which the listing was sold
     */
    soldDate?: Date;
    soldDays?: number;
    acquisitionType?: string;
}