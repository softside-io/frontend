import { inject } from '@angular/core';

import { ApiModule, Configuration, LoginResponseType } from 'projects/api';

import { environment } from '../environments/environment';
import { StorageAccessorService } from './shared/services/storage-accessor.service';

export const modules = [ApiModule.forRoot(apiConfigFactory)];
export function apiConfigFactory(): Configuration {
	const storage = inject(StorageAccessorService);

	return new Configuration({
		basePath: environment.apiBasePath,
		accessToken: (): string => {
			const session = storage.getLocalStorage<LoginResponseType>('session', true);
			const checkSession = !!session && typeof session !== 'string';

			if (!checkSession) {
				return '';
			}

			if (new Date(session.tokenExpires).getTime() < Date.now()) {
				return session.refreshToken;
			} else {
				return session.token;
			}
		},
	});
}
