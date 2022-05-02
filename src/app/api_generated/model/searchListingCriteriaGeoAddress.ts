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
import { Coordinate } from './coordinate';
import { Pagination } from './pagination';
import { SearchCriteriaListing } from './searchCriteriaListing';
import { SearchListingCriteriaGeoAddressBounds } from './searchListingCriteriaGeoAddressBounds';

export interface SearchListingCriteriaGeoAddress { 
    id?: string;
    name?: string;
    coordinates?: Coordinate;
    /**
     * Place identifier
     */
    placeId?: string;
    userLocation?: Coordinate;
    criteria?: SearchCriteriaListing;
    pagination?: Pagination;
    address?: string;
    bounds?: SearchListingCriteriaGeoAddressBounds;
}