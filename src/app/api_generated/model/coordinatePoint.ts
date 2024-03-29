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

/**
 * A latitude and longitude point coordinate
 */
export interface CoordinatePoint { 
    type?: CoordinatePoint.TypeEnum;
    coordinates?: Coordinate;
}
export namespace CoordinatePoint {
    export type TypeEnum = 'Point';
    export const TypeEnum = {
        Point: 'Point' as TypeEnum
    };
}