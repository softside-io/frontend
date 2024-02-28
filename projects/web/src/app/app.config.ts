import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IonicRouteStrategy, createAnimation, provideIonicAngular } from '@ionic/angular/standalone';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

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
		{
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(environment.googleClientId, {
							prompt_parent_id: 'googleLoginWrapper',
						}),
					},
				],
				onError: (err) => {
					console.error(err);
				},
			} as SocialAuthServiceConfig,
		},
	],
};
// Initialize application configuration function
export function initializeApplicationConfig(sessionService: SessionService) {
	// returning promise so that getting this file is blocking to the UI
	return (): Promise<void> =>
		new Promise((resolve, _reject) => {
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

				resolve();
			});
		});
}
