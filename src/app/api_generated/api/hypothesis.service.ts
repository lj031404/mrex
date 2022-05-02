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
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { Hypothesis } from '../model/hypothesis';
import { HypothesisInput } from '../model/hypothesisInput';
import { ModelError } from '../model/modelError';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class HypothesisService {

    protected basePath = 'https://api.mrex.co/v1';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Post a new hypothesis input parameters and return the result
     * 
     * @param body An hypothesis input attributes
     * @param save Save or not to DB. Not saving to DB by default
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addHypothesis(body: HypothesisInput, save?: boolean, observe?: 'body', reportProgress?: boolean): Observable<Hypothesis>;
    public addHypothesis(body: HypothesisInput, save?: boolean, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Hypothesis>>;
    public addHypothesis(body: HypothesisInput, save?: boolean, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Hypothesis>>;
    public addHypothesis(body: HypothesisInput, save?: boolean, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling addHypothesis.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (save !== undefined && save !== null) {
            queryParameters = queryParameters.set('save', <any>save);
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // authentication (oAuthNoScopes) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<Hypothesis>('post',`${this.basePath}/hypothesis`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete a hypothesis
     * 
     * @param hypothesisId hypothesisId
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteHypothesis(hypothesisId: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public deleteHypothesis(hypothesisId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public deleteHypothesis(hypothesisId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public deleteHypothesis(hypothesisId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (hypothesisId === null || hypothesisId === undefined) {
            throw new Error('Required parameter hypothesisId was null or undefined when calling deleteHypothesis.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // authentication (oAuthNoScopes) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<any>('delete',`${this.basePath}/hypothesis/${encodeURIComponent(String(hypothesisId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get a list of my saved hypothesis
     * 
     * @param hypothesisId hypothesisId
     * @param revision Get a specific version
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUserHypothesis(hypothesisId: string, revision?: string, observe?: 'body', reportProgress?: boolean): Observable<Hypothesis>;
    public getUserHypothesis(hypothesisId: string, revision?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Hypothesis>>;
    public getUserHypothesis(hypothesisId: string, revision?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Hypothesis>>;
    public getUserHypothesis(hypothesisId: string, revision?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (hypothesisId === null || hypothesisId === undefined) {
            throw new Error('Required parameter hypothesisId was null or undefined when calling getUserHypothesis.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (revision !== undefined && revision !== null) {
            queryParameters = queryParameters.set('revision', <any>revision);
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // authentication (oAuthNoScopes) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Hypothesis>('get',`${this.basePath}/hypothesis/${encodeURIComponent(String(hypothesisId))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get a list of my saved hypothesis
     * 
     * @param propertyId Return hypothesis that matche these property Ids only
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public listUserHypothesis(propertyId?: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<Array<Hypothesis>>;
    public listUserHypothesis(propertyId?: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Hypothesis>>>;
    public listUserHypothesis(propertyId?: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Hypothesis>>>;
    public listUserHypothesis(propertyId?: Array<string>, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (propertyId) {
            propertyId.forEach((element) => {
                queryParameters = queryParameters.append('propertyId', <any>element);
            })
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // authentication (oAuthNoScopes) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<Hypothesis>>('get',`${this.basePath}/hypothesis`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update a hypothesis
     * 
     * @param body An hypothesis input attributes
     * @param hypothesisId hypothesisId
     * @param save Save or not to DB
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateHypothesis(body: HypothesisInput, hypothesisId: string, save?: string, observe?: 'body', reportProgress?: boolean): Observable<Hypothesis>;
    public updateHypothesis(body: HypothesisInput, hypothesisId: string, save?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Hypothesis>>;
    public updateHypothesis(body: HypothesisInput, hypothesisId: string, save?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Hypothesis>>;
    public updateHypothesis(body: HypothesisInput, hypothesisId: string, save?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateHypothesis.');
        }

        if (hypothesisId === null || hypothesisId === undefined) {
            throw new Error('Required parameter hypothesisId was null or undefined when calling updateHypothesis.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (save !== undefined && save !== null) {
            queryParameters = queryParameters.set('save', <any>save);
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // authentication (oAuthNoScopes) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<Hypothesis>('put',`${this.basePath}/hypothesis/${encodeURIComponent(String(hypothesisId))}`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
