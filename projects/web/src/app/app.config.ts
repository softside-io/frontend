import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IonicRouteStrategy, createAnimation, provideIonicAngular } from '@ionic/angular/standalone';

import { OpenAPI } from 'projects/api';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/http.interceptor';
import { modules } from './app.modules';
import { SessionService } from './core/services/session.service';
import { environment } from '../environments/environment';
import { ThemeService } from './core/services/theme.service';

const animationDuration = 150;

export const appConfig: ApplicationConfig = {
	providers: [
		provideIonicAngular({
			mode: 'md',
			navAnimation: (_baseEl, opts) => {
				const enteringAnimation = createAnimation()
					.addElement(opts.enteringEl)
					.fromTo('opacity', 0, 1)
					.delay(animationDuration)
					.duration(animationDuration);
				const leavingAnimation = createAnimation()
					.addElement(opts.leavingEl)
					.fromTo('opacity', 1, 0)
					.duration(animationDuration);
				const animation = createAnimation().addAnimation(enteringAnimation).addAnimation(leavingAnimation);

				return animation;
			},
		}),
		provideHttpClient(withInterceptors([authInterceptor])),
		importProvidersFrom(modules),
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
		provideRouter(routes, withComponentInputBinding()),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApplicationConfig,
			deps: [SessionService, ThemeService],
			multi: true,
		},
	],
};
// Initialize application configuration function
export function initializeApplicationConfig(sessionService: SessionService) {
	// returning promise so that getting this file is blocking to the UI
	return (): Promise<void> =>
		new Promise((resolve, _reject) => {
			let progress = 0;
			let progressValue = 1;
			let loaded = false;
			const startTime = Date.now();
			const loader = document.querySelector('#splash .loader') as HTMLElement;
			const minimumDelayTime = 750;

			sessionService.getSessionFromStorage().add(() => {
				OpenAPI.BASE = environment.openAPIBase;
				OpenAPI.TOKEN = (): Promise<string> => {
					const auth = sessionService.auth;
					const checkSession = !!auth && typeof auth !== 'string';

					if (!checkSession) {
						return Promise.resolve('');
					}

					if (new Date(auth.tokenExpires).getTime() < Date.now()) {
						return Promise.resolve(auth.refreshToken);
					} else {
						return Promise.resolve(auth.token);
					}
				};

				const endTime = Date.now();
				const elapsedTime = minimumDelayTime - (endTime - startTime);
				const delayTime = elapsedTime < 0 ? 0 : elapsedTime;

				resolve();

				const delayTimeout = setTimeout(() => {
					loaded = true;
					clearTimeout(delayTimeout);
				}, delayTime);
			});

			const interval = setInterval(() => {
				progress += progressValue;

				if (progress > 60) {
					progressValue = 0.05;
				}

				if (progress >= 100) {
					progress = 100;
					clearInterval(interval);

					const delayFadeOut = setTimeout(() => {
						loader.parentElement?.classList.add('transition-opacity', 'duration-500', 'opacity-0');
						clearTimeout(delayFadeOut);
						const fadeOutTimeout = setTimeout(() => {
							loader.parentElement?.remove();
							clearTimeout(fadeOutTimeout);
						}, 500);
					}, 100);
				}

				if (loader) {
					loader.style.setProperty('--width', progress + '%');
				}

				if (loaded) {
					progressValue = 20;
				}
			}, 50);
			// Here 50 should be the same as the transition speed on loader::before (projects\softside\ui-sdk\scss\02-generic\_generic.scss)
		});
}
