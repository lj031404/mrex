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
 * Source of the data
 */
export interface Source { 
    /**
     * Date at which the listing was published
     */
    date?: string;
    /**
     * Supplier name from which the data comes from
     */
    supplier?: string;
    /**
     * id of the source id
     */
    sourceId?: string;
    /**
     * name of the service that processed the raw data to MREX
     */
    service?: string;
    updatedOn?: string;
    /**
     * Git commit hash of the service
     */
    serviceVersion?: string;
    /**
     * URL of the original listing
     */
    url?: string;
}