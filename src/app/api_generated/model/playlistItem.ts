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
import { Language } from './language';

/**
 * A playlist item
 */
export interface PlaylistItem { 
    /**
     * id of the playlist
     */
    id?: string;
    language?: Language;
    title?: string;
    summary?: string;
    publishDate?: Date;
    thumbnailUrl?: string;
}