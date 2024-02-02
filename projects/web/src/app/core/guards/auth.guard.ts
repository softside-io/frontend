import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OperatorFunction, of, switchMap } from 'rxjs';

// if user is not authorized to access a page, the user will be redirected to the login with a return URL
export const authGuard = (_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): OperatorFunction<unknown, unknown> =>
	switchMap((user: unknown) => {
		return of(user);
	});
export const verifyGuard = (_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): OperatorFunction<unknown, unknown> =>
	switchMap((user: unknown) => {
		return of(user);
	});
