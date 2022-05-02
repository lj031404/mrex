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
import { Expenses } from './expenses';
import { ExteriorCoating } from './exteriorCoating';
import { ExternalLink } from './externalLink';
import { FoundationMaterial } from './foundationMaterial';
import { GrossIncome } from './grossIncome';
import { Heating } from './heating';
import { Lease } from './lease';
import { ListingStatuses } from './listingStatuses';
import { ListingType } from './listingType';
import { Maintenance } from './maintenance';
import { ModelProperty } from './modelProperty';
import { Picture } from './picture';
import { PorfolioPrimaryFinancing } from './porfolioPrimaryFinancing';
import { PorfolioSecondaryFinancing } from './porfolioSecondaryFinancing';
import { PortfolioPropertyStatus } from './portfolioPropertyStatus';
import { PropertyType } from './propertyType';
import { PropertyVideo } from './propertyVideo';
import { ReceiveOfferStatus } from './receiveOfferStatus';
import { ResidentialDistribution } from './residentialDistribution';
import { RoofMaterial } from './roofMaterial';
import { Seller } from './seller';
import { Source } from './source';

/**
 * Portfolio create/update property object
 */
export interface PortfolioPropertyCreate extends ModelProperty { 
    propertyId?: string;
    /**
     * Google Place ID
     */
    placeId?: string;
    purchaseDate?: Date;
    purchasePrice?: number;
    primaryFinancing?: PorfolioPrimaryFinancing;
    secondaryFinancing?: PorfolioSecondaryFinancing;
    receiveOfferStatus?: ReceiveOfferStatus;
    portfolioStatus?: PortfolioPropertyStatus;
}