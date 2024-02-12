/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import type { CreateUserDto } from '../models/CreateUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { User } from '../models/User';

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

    constructor(public readonly http: HttpClient) {}

    /**
     * @param requestBody 
     * @returns User 
     * @throws ApiError
     */
    public create(
requestBody: CreateUserDto,
): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param page 
     * @param limit 
     * @param filters 
     * @param sort 
     * @returns any 
     * @throws ApiError
     */
    public findAll(
page?: number,
limit?: number,
filters?: string,
sort?: string,
): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/users',
            query: {
                'page': page,
                'limit': limit,
                'filters': filters,
                'sort': sort,
            },
        });
    }

    /**
     * @param id 
     * @returns any 
     * @throws ApiError
     */
    public findOne(
id: string,
): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns any 
     * @throws ApiError
     */
    public update(
id: string,
requestBody: UpdateUserDto,
): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns void 
     * @throws ApiError
     */
    public remove(
id: string,
): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
        });
    }

}
