/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import type { AuthAppleLoginDto } from '../models/AuthAppleLoginDto';
import type { AuthConfirmEmailDto } from '../models/AuthConfirmEmailDto';
import type { AuthEmailLoginDto } from '../models/AuthEmailLoginDto';
import type { AuthFacebookLoginDto } from '../models/AuthFacebookLoginDto';
import type { AuthForgotPasswordDto } from '../models/AuthForgotPasswordDto';
import type { AuthGoogleLoginDto } from '../models/AuthGoogleLoginDto';
import type { AuthRegisterLoginDto } from '../models/AuthRegisterLoginDto';
import type { AuthResendEmailDto } from '../models/AuthResendEmailDto';
import type { AuthResetPasswordDto } from '../models/AuthResetPasswordDto';
import type { AuthTwitterLoginDto } from '../models/AuthTwitterLoginDto';
import type { AuthUpdateDto } from '../models/AuthUpdateDto';
import type { SessionType } from '../models/SessionType';
import type { User } from '../models/User';

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(public readonly http: HttpClient) {}

	/**
	 * @param requestBody
	 * @returns SessionType
	 * @throws ApiError
	 */
	public login(requestBody: AuthEmailLoginDto): Observable<SessionType> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/email/login',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @param requestBody
	 * @returns void
	 * @throws ApiError
	 */
	public register(requestBody: AuthRegisterLoginDto): Observable<void> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/email/register',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @param requestBody
	 * @returns void
	 * @throws ApiError
	 */
	public confirmEmail(requestBody: AuthConfirmEmailDto): Observable<void> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/email/confirm',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @param requestBody
	 * @returns void
	 * @throws ApiError
	 */
	public sendVerificationEmail(requestBody: AuthResendEmailDto): Observable<void> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/email/resend',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @param requestBody
	 * @returns void
	 * @throws ApiError
	 */
	public forgotPassword(requestBody: AuthForgotPasswordDto): Observable<void> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/forgot/password',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @param requestBody
	 * @returns void
	 * @throws ApiError
	 */
	public resetPassword(requestBody: AuthResetPasswordDto): Observable<void> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/reset/password',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @returns User
	 * @throws ApiError
	 */
	public me(): Observable<User> {
		return __request(OpenAPI, this.http, {
			method: 'GET',
			url: '/api/v1/auth/me',
		});
	}

	/**
	 * @param requestBody
	 * @returns any
	 * @throws ApiError
	 */
	public update(requestBody: AuthUpdateDto): Observable<any> {
		return __request(OpenAPI, this.http, {
			method: 'PATCH',
			url: '/api/v1/auth/me',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @returns void
	 * @throws ApiError
	 */
	public delete(): Observable<void> {
		return __request(OpenAPI, this.http, {
			method: 'DELETE',
			url: '/api/v1/auth/me',
		});
	}

	/**
	 * @returns any
	 * @throws ApiError
	 */
	public refresh(): Observable<{
		token: string;
		refreshToken: string;
		tokenExpires: number;
	}> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/refresh',
		});
	}

	/**
	 * @returns void
	 * @throws ApiError
	 */
	public logout(): Observable<void> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/logout',
		});
	}

	/**
	 * @param requestBody
	 * @returns any
	 * @throws ApiError
	 */
	public login1(requestBody: AuthFacebookLoginDto): Observable<any> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/facebook/login',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @param requestBody
	 * @returns any
	 * @throws ApiError
	 */
	public login2(requestBody: AuthGoogleLoginDto): Observable<any> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/google/login',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @param requestBody
	 * @returns any
	 * @throws ApiError
	 */
	public login3(requestBody: AuthTwitterLoginDto): Observable<any> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/twitter/login',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @param requestBody
	 * @returns any
	 * @throws ApiError
	 */
	public login4(requestBody: AuthAppleLoginDto): Observable<any> {
		return __request(OpenAPI, this.http, {
			method: 'POST',
			url: '/api/v1/auth/apple/login',
			body: requestBody,
			mediaType: 'application/json',
		});
	}
}
