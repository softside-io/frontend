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
			deps: [SessionService],
			multi: true,
		},
	],
};
// Initialize application configuration function
export function initializeApplicationConfig(sessionService: SessionService) {
	// returning promise so that getting this file is blocking to the UI
	return (): Promise<void> =>

		new Promise((resolve, _reject) => {
			OpenAPI.BASE = environment.openAPIBase;
			OpenAPI.TOKEN = (): Promise<string> => {
				const session = sessionService.getSession();
				const checkSession = !!session && typeof session !== 'string';

				if (!checkSession) {
					return Promise.resolve('');
				}

				if (new Date(session.tokenExpires).getTime() < Date.now()) {
					return Promise.resolve(session.refreshToken);
				} else {
					return Promise.resolve(session.token);
				}
			};

			resolve();
		});
}
