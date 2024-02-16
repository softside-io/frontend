import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

import { SessionService } from '../services/session.service';

export const authenticationGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
	const sessionService = inject(SessionService);
	const router = inject(Router);

	if (sessionService.isLoggedIn()) {
		if (sessionService.isVerified()) {
			return true;
		} else {
			router.navigate(['/auth/confirm-email']);

			return false;
		}
	}

	router.navigate(['/auth']);

	return false;
};
export const publicGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
	const sessionService = inject(SessionService);
	const router = inject(Router);

	if (!sessionService.isLoggedIn()) {
		return true;
	}

	router.navigate(['/']);

	return false;
};
export const verifyGuard: CanActivateFn = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
	const sessionService = inject(SessionService);
	const router = inject(Router);
	const hash = route.queryParams['hash'];

	if ((sessionService.isLoggedIn() && !sessionService.isVerified()) || hash) {
		return true;
	}

	router.navigate(['/']);

	return false;
};
