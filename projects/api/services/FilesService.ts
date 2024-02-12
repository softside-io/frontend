/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

@Injectable({
  providedIn: 'root',
})
export class FilesService {

    constructor(public readonly http: HttpClient) {}

    /**
     * @param formData 
     * @returns any 
     * @throws ApiError
     */
    public uploadFile(
formData: {
file?: Blob;
},
): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/files/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @param path 
     * @returns any 
     * @throws ApiError
     */
    public download(
path: string,
): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/files/{path}',
            path: {
                'path': path,
            },
        });
    }

}
