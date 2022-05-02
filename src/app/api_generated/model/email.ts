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

export interface Email { 
    /**
     * Subject to send
     */
    subject?: string;
    /**
     * HTML Message to send
     */
    message?: string;
    /**
     * userId
     */
    userId?: string;
    /**
     * iswheter the email is an HTML message
     */
    isHTML?: boolean;
}