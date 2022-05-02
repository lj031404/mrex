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

import { ChartIdentifiers } from '../model/chartIdentifiers';
import { City } from '../model/city';
import { District } from '../model/district';
import { InlineResponse2006 } from '../model/inlineResponse2006';
import { Market } from '../model/market';
import { ModelError } from '../model/modelError';
import { PropertyType } from '../model/propertyType';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class MarketsService {

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
     * Market chart data
     * 
     * @param cityId ID of the market
     * @param chartId ID of the chart
     * @param fromDate from date
     * @param districtId ID of the district
     * @param propertyType property type
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getChartId(cityId: string, chartId: ChartIdentifiers, fromDate: string, districtId?: string, propertyType?: PropertyType, observe?: 'body', reportProgress?: boolean): Observable<InlineResponse2006>;
    public getChartId(cityId: string, chartId: ChartIdentifiers, fromDate: string, districtId?: string, propertyType?: PropertyType, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<InlineResponse2006>>;
    public getChartId(cityId: string, chartId: ChartIdentifiers, fromDate: string, districtId?: string, propertyType?: PropertyType, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<InlineResponse2006>>;
    public getChartId(cityId: string, chartId: ChartIdentifiers, fromDate: string, districtId?: string, propertyType?: PropertyType, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (cityId === null || cityId === undefined) {
            throw new Error('Required parameter cityId was null or undefined when calling getChartId.');
        }

        if (chartId === null || chartId === undefined) {
            throw new Error('Required parameter chartId was null or undefined when calling getChartId.');
        }

        if (fromDate === null || fromDate === undefined) {
            throw new Error('Required parameter fromDate was null or undefined when calling getChartId.');
        }



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (districtId !== undefined && districtId !== null) {
            queryParameters = queryParameters.set('districtId', <any>districtId);
        }
        if (fromDate !== undefined && fromDate !== null) {
            queryParameters = queryParameters.set('fromDate', <any>fromDate);
        }
        if (propertyType !== undefined && propertyType !== null) {
            queryParameters = queryParameters.set('propertyType', <any>propertyType);
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

        return this.httpClient.request<InlineResponse2006>('get',`${this.basePath}/markets/${encodeURIComponent(String(cityId))}/charts/${encodeURIComponent(String(chartId))}`,
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
     * List of cities
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCities(observe?: 'body', reportProgress?: boolean): Observable<Array<City>>;
    public getCities(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<City>>>;
    public getCities(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<City>>>;
    public getCities(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<City>>('get',`${this.basePath}/markets/cities`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * List of districts in a city
     * 
     * @param cityId ID of the city
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDistricts(cityId: string, observe?: 'body', reportProgress?: boolean): Observable<Array<District>>;
    public getDistricts(cityId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<District>>>;
    public getDistricts(cityId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<District>>>;
    public getDistricts(cityId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (cityId === null || cityId === undefined) {
            throw new Error('Required parameter cityId was null or undefined when calling getDistricts.');
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

        return this.httpClient.request<Array<District>>('get',`${this.basePath}/markets/cities/${encodeURIComponent(String(cityId))}/districts`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Market data
     * 
     * @param cityId ID of the market
     * @param districtId ID of the district
     * @param propertyType property type
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getMarketId(cityId: string, districtId: string, propertyType?: PropertyType, observe?: 'body', reportProgress?: boolean): Observable<Market>;
    public getMarketId(cityId: string, districtId: string, propertyType?: PropertyType, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Market>>;
    public getMarketId(cityId: string, districtId: string, propertyType?: PropertyType, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Market>>;
    public getMarketId(cityId: string, districtId: string, propertyType?: PropertyType, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (cityId === null || cityId === undefined) {
            throw new Error('Required parameter cityId was null or undefined when calling getMarketId.');
        }

        if (districtId === null || districtId === undefined) {
            throw new Error('Required parameter districtId was null or undefined when calling getMarketId.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (districtId !== undefined && districtId !== null) {
            queryParameters = queryParameters.set('districtId', <any>districtId);
        }
        if (propertyType !== undefined && propertyType !== null) {
            queryParameters = queryParameters.set('propertyType', <any>propertyType);
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

        return this.httpClient.request<Market>('get',`${this.basePath}/markets/${encodeURIComponent(String(cityId))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}