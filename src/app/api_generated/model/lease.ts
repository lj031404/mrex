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
import { Contact } from './contact';
import { Currency } from './currency';
import { Inclusion } from './inclusion';
import { UnitType } from './unitType';

/**
 * Lease details
 */
export interface Lease { 
    /**
     * Monthly rent
     */
    rent?: number;
    currency?: Currency;
    suite?: string;
    tenant?: Contact;
    type?: UnitType;
    from?: Date;
    to?: Date;
    furnished?: boolean;
    /**
     * area of the apartment (m2)
     */
    area?: number;
    rooms?: Lease.RoomsEnum;
    inclusion?: Array<Inclusion>;
    smokingAllowed?: boolean;
    petAllowed?: boolean;
}
export namespace Lease {
    export type RoomsEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    export const RoomsEnum = {
        NUMBER_1: 1 as RoomsEnum,
        NUMBER_2: 2 as RoomsEnum,
        NUMBER_3: 3 as RoomsEnum,
        NUMBER_4: 4 as RoomsEnum,
        NUMBER_5: 5 as RoomsEnum,
        NUMBER_6: 6 as RoomsEnum,
        NUMBER_7: 7 as RoomsEnum,
        NUMBER_8: 8 as RoomsEnum
    };
}