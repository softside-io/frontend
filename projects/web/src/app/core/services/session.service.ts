import { Injectable, inject, signal } from '@angular/core';
import { of, Observable, Subject, tap, take, finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { AppSettingsService } from 'projects/web/src/app/shared/services/app-settings.service';
import { StorageAccessorService } from 'projects/web/src/app/shared/services/storage-accessor.service';
import { ImageUploadService } from 'projects/web/src/app/shared/services/image-upload.service';
import { AuthService } from 'projects/api';

import { LoginResponseType, User } from '../../shared/models/IUser.model';

@Injectable({
	providedIn: 'root',
})
export class SessionService {
	storage = inject(StorageAccessorService);
	authService = inject(AuthService);
	appSettings = inject(AppSettingsService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	imageService = inject(ImageUploadService);
	userIsGettingDeleted$ = new Subject<boolean>();
	loggedInWithGoogle = signal(false);
	loggedInWithPassword = signal(false);

	get currentUserProfile$(): Observable<User | null> {
		return of({
			firstName: 'Hisham',
			lastName: 'Buteen',
			email: 'hisham.buteen@gmail.com',
		} as User);
	}

	userProvider<T = unknown>(_callback: (user: unknown) => Observable<T>): Observable<T> {
		return of({} as T);
	}

	// populateUser(): IUser {
	// 	// const { firstName, lastName } = this.getUserNames(displayName || '');
	// 	// const newUser: IUser = {
	// 	// 	uid,
	// 	// 	email: email || '',
	// 	// 	firstName,
	// 	// 	lastName,
	// 	// 	phone: phoneNumber || '',
	// 	// 	address: '',
	// 	// 	photoURL: photoURL || '',
	// 	// };
	// 	return {} as IUser;
	// }

	getUserNames(displayName: string): { firstName: string; lastName: string } {
		const name = displayName?.split(' ');

		let firstName = displayName || '',
			lastName = '';

		if (name && name?.length > 1) {
			firstName = name[0];
			name.shift();
			lastName = name.join(' ');
		}

		return {
			firstName,
			lastName,
		};
	}

	getUserDisplay(user: User): string {
		let name = '';

		if (user.firstName) {
			name = user.firstName + ' ' + user.lastName;
		} else if (user.email) {
			name = user.email;
		}

		return name;
	}

	// registerNewAccount(_email: string, _password: string): Observable<UserCredential> {
	// 	// return from(createUserWithEmailAndPassword(this.auth, email, password));
	// 	return of({} as UserCredential);
	// }

	// sendVerificationEmail(user: User): Observable<void> {
	// 	return from(
	// 		sendEmailVerification(user, {
	// 			url: this.appSettings.getUrlOrigin() + (this.route.snapshot.queryParams['returnUrl'] || '/home'),
	// 		}),
	// 	);
	// }

	// loginWithGoogle(): Observable<UserCredential> {
	// 	return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
	// }

	loginWithEmailAndPassword(email: string, password: string): Observable<LoginResponseType> {
		return this.authService.login({ email, password }).pipe(
			tap({
				next: (session) => this.storage.setLocalStorage('session', session, true),
			}),
		);
	}

	refreshToken(): Observable<Omit<LoginResponseType, 'user'>> {
		return this.authService.refresh().pipe(
			tap({
				next: (session) => {
					const currentSession = this.storage.getLocalStorage<LoginResponseType>('session', true) as LoginResponseType;
					this.storage.setLocalStorage('session', { ...currentSession, ...session }, true);
				},
			}),
		);
	}

	isLoggedIn(): boolean {
		console.log(this.storage.getLocalStorage<LoginResponseType>('session', true));

		return this.storage.getLocalStorage<LoginResponseType>('session', true) !== null;
	}

	// forgetPassword(email: string): Observable<evoid> {
	// 	return from(
	// 		sendPasswordResetEmail(this.auth, email, {
	// 			url: this.appSettings.getUrlOrigin() + '/auth/login?passwordChanged=true',
	// 		}),
	// 	);
	// }

	logout(): Observable<void> {
		return this.authService.logout().pipe(
			take(1),
			finalize(() => {
				this.storage.removeLocalStorageKey('session');
				this.router.navigate(['/auth']);
			}),
		);
	}

	// updateUser(user: IUser): Observable<void> {
	// 	const ref = doc(this.db, 'users', user.uid);

	// 	return from(updateDoc(ref, { ...user }));
	// }

	// linkUser(user: User, newPassword: string): Observable<UserCredential> {
	// 	const creds = EmailAuthProvider.credential(user.email!, newPassword);

	// 	return from(linkWithCredential(user, creds));
	// }

	// validatePassword(user: User, currentPassword: string): Observable<UserCredential> {
	// 	const creds = EmailAuthProvider.credential(user.email!, currentPassword);

	// 	return from(reauthenticateWithCredential(user, creds));
	// }

	// updatePassword(user: User, newPassword: string): Observable<void> {
	// 	return from(updatePassword(user, newPassword));
	// }

	// deleteUser(user: User): Observable<void> {
	// 	const ref = doc(this.db, 'users', user.uid);
	// 	this.userIsGettingDeleted$.next(true);

	// 	return from(deleteDoc(ref)).pipe(
	// 		switchMap(() => {
	// 			return this.imageService.deleteImage(`${environment.profileCDNPath}${user.uid}`).pipe(
	// 				catchError((_error) => {
	// 					return of(true);
	// 				}),
	// 				switchMap(() => {
	// 					return deleteUser(user);
	// 				}),
	// 			);
	// 		}),
	// 		finalize(() => {
	// 			this.userIsGettingDeleted$.next(false);
	// 		}),
	// 	);
	// }
}
