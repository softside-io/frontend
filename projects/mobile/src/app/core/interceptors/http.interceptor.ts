import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptorFn, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, concatMap, filter, finalize, take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

import { AppSettingsService } from '../../shared/services/app-settings.service';
import { SessionService } from '../services/session.service';

const requestQueue: Array<HttpRequest<unknown>> = [];

let isTokenRefreshInProgress = false;
let sessionService: SessionService;
let toastController: ToastController;
let appSettingsService: AppSettingsService;
const refreshTokenSubject$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
	appSettingsService = inject(AppSettingsService);
	toastController = inject(ToastController);
	sessionService = inject(SessionService);

	if (requestQueue.length === 0) {
		appSettingsService.toggleIsLoading(true);
	}

	requestQueue.push(request);

	return next(request).pipe(
		catchError((error: Error) => {
			if (error instanceof HttpErrorResponse) {
				if (error.status === 401) {
					return handle401Error(request, next);
				} else {
					toast(error);
					// this._errorHandlingService.handleHttpError(error);
					throw new Error(error.message);
				}
			} else {
				// this._errorHandlingService.handleNonHttpError(error);

				throw new Error(error.message);
			}
		}),
		finalize(() => {
			removeRequestsFromQueue(request);

			if (requestQueue.length === 0) {
				appSettingsService.toggleIsLoading(false);
			}
		}),
	);
};

const removeRequestsFromQueue = (req: HttpRequest<unknown>): void => {
	const i = requestQueue.indexOf(req);

	if (i >= 0) {
		requestQueue.splice(i, 1);
	}
};
const handle401Error = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
	if (request.url.includes('/api/v1/auth/refresh')) {
		clearRequestQueue();
		console.warn('log out');
		// this._broadcastService.sendMessage({ action: 'logout', data: { includeReturnUrl: true } });

		return EMPTY;
	}

	if (!isTokenRefreshInProgress) {
		isTokenRefreshInProgress = true;

		return refreshTheToken(request, next);
	} else {
		return waitForRefreshToken(request, next);
	}
};
const clearRequestQueue = (): void => {
	if (requestQueue.length > 0) {
		requestQueue.length = 0;
		appSettingsService.toggleIsLoading(false);
	}
};
const toast = (error: HttpErrorResponse): void => {
	toastController
		.create({
			message: error.message,
			duration: 1500,
			position: 'top',
		})
		.then((toast) => {
			toast.present();
		}); // 	throw new Error(error.message);
};
const refreshTheToken = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
	return sessionService.refreshToken().pipe(
		concatMap((response) => {
			refreshTokenSubject$.next(response.token);

			return next(cloneAndUpdateToken(request, response.token));
		}),
		finalize(() => {
			isTokenRefreshInProgress = false;
		}),
	);
};
const waitForRefreshToken = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
	return refreshTokenSubject$.pipe(
		filter((token) => token != null),
		take(1),
		concatMap((token) => {
			return next(cloneAndUpdateToken(request, token!));
		}),
	);
};
const cloneAndUpdateToken = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
	return request.clone({
		headers: request.headers.set('Authorization', `Bearer ${token}`),
	});
};
