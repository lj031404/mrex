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
import { Address } from './address';
import { Apraisal } from './apraisal';
import { Assessment } from './assessment';
import { Attributes } from './attributes';
import { CommercialSpace } from './commercialSpace';
import { Contact } from './contact';
import { Currency } from './currency';
import { Expenses } from './expenses';
import { ExpertAnalysisVideo } from './expertAnalysisVideo';
import { ExteriorCoating } from './exteriorCoating';
import { ExternalLink } from './externalLink';
import { FoundationMaterial } from './foundationMaterial';
import { GrossIncome } from './grossIncome';
import { Heating } from './heating';
import { HistoricalPerformanceItem } from './historicalPerformanceItem';
import { Lease } from './lease';
import { ListingAcquisitionCosts } from './listingAcquisitionCosts';
import { ListingExpenses } from './listingExpenses';
import { ListingFeature } from './listingFeature';
import { ListingFinancing } from './listingFinancing';
import { ListingIncome } from './listingIncome';
import { ListingMetrics } from './listingMetrics';
import { ListingStatuses } from './listingStatuses';
import { ListingType } from './listingType';
import { Maintenance } from './maintenance';
import { MarketPropertyUnits } from './marketPropertyUnits';
import { ModelProperty } from './modelProperty';
import { Picture } from './picture';
import { PropertyHistoryItem } from './propertyHistoryItem';
import { PropertyType } from './propertyType';
import { PropertyVideo } from './propertyVideo';
import { QualificationRate } from './qualificationRate';
import { RentMeter } from './rentMeter';
import { ResidentialDistribution } from './residentialDistribution';
import { RoofMaterial } from './roofMaterial';
import { Seller } from './seller';
import { Source } from './source';
import { ValuationMeter } from './valuationMeter';

/**
 * A listing on the market place
 */
export interface Listing extends ModelProperty { 
    units?: Array<MarketPropertyUnits>;
    features?: Array<ListingFeature>;
    metrics?: ListingMetrics;
    acquisitionCosts?: ListingAcquisitionCosts;
    income?: ListingIncome;
    normalizedExpenses?: ListingExpenses;
    financing?: ListingFinancing;
    qualification?: Array<QualificationRate>;
    analysis?: Array<ExpertAnalysisVideo>;
    /**
     * Evolution of price at each transaction
     */
    historicalPerformance?: Array<HistoricalPerformanceItem>;
    activityHistory?: Array<PropertyHistoryItem>;
    /**
     * Main image URL
     */
    image?: string;
    /**
     * List of pictures
     */
    pictures?: Array<Picture>;
    listingType?: ListingType;
    /**
     * Timestamp at which the listing was created
     */
    createdAt?: Date;
    currency?: Currency;
    /**
     * Publish date at which the listing was published
     */
    publishDate?: Date;
    /**
     * Original asking price
     */
    originalPrice?: number;
    /**
     * Updated asking price
     */
    updatedPrice?: number;
    /**
     * Date at which the listing price was updated
     */
    updatedPriceDate?: Date;
    /**
     * Sold price
     */
    soldPrice?: number;
    /**
     * Date at which the listing was sold
     */
    soldDate?: Date;
    /**
     * Date at which the listing was expired
     */
    expiredDate?: Date;
    /**
     * Date at which the listing was canceled
     */
    canceledDate?: Date;
    /**
     * number of days to sell
     */
    saleDelay?: number;
    status?: ListingStatuses;
    /**
     * Used for private listingType. Address fields and price are hidden unless the owner agrees to share its data with the investor
     */
    hideFields?: boolean;
    propertyId?: string;
    /**
     * Distance in km to the point of interest
     */
    distance?: number;
    /**
     * Property cap rate in %
     */
    caprate?: number;
    /**
     * Listing note entered by the user
     */
    note?: string;
    rentMeter?: RentMeter;
    valuationMeter?: ValuationMeter;
}