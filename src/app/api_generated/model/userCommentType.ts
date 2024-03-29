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

export type UserCommentType = 'billing' | 'bug' | 'dataInconsistency' | 'featureRequest' | 'other' | 'suggestion' | 'support';

export const UserCommentType = {
    Billing: 'billing' as UserCommentType,
    Bug: 'bug' as UserCommentType,
    DataInconsistency: 'dataInconsistency' as UserCommentType,
    FeatureRequest: 'featureRequest' as UserCommentType,
    Other: 'other' as UserCommentType,
    Suggestion: 'suggestion' as UserCommentType,
    Support: 'support' as UserCommentType
};