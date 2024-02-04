import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

import { SessionService } from '../services/session.service';

export const authenticationGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
	const sessionService = inject(SessionService);

	if (sessionService.isLoggedIn()) {
		return true;
	}

	inject(Router).navigate(['/auth']);

	return false;
};
export const publicGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
	const sessionService = inject(SessionService);

	if (!sessionService.isLoggedIn()) {
		return true;
	}

	inject(Router).navigate(['/']);

	return false;
};
