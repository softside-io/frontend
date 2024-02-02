import { Injectable, inject, signal } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { AppSettingsService } from 'projects/web/src/app/shared/services/app-settings.service';
import { StorageAccessorService } from 'projects/web/src/app/shared/services/storage-accessor.service';
import { ImageUploadService } from 'projects/web/src/app/shared/services/image-upload.service';

import { IUser } from '../../shared/models/IUser.model';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	storage = inject(StorageAccessorService);
	appSettings = inject(AppSettingsService);
	route = inject(ActivatedRoute);
	imageService = inject(ImageUploadService);
	userIsGettingDeleted$ = new Subject<boolean>();
	loggedInWithGoogle = signal(false);
	loggedInWithPassword = signal(false);

	get currentUserProfile$(): Observable<IUser | null> {
		return of({
			firstName: 'Hisham',
			lastName: 'Buteen',
			uid: '123123123',
			address: 'Test Test',
			email: 'hisham.buteen@gmail.com',
			phone: '70407572',
			photoURL:
				'data:image/jpeg;base64,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',
		} as IUser);
	}

	userProvider<T = unknown>(_callback: (user: unknown) => Observable<T>): Observable<T> {
		return of({} as T);
	}

	populateUser(): IUser {
		// const { firstName, lastName } = this.getUserNames(displayName || '');
		// const newUser: IUser = {
		// 	uid,
		// 	email: email || '',
		// 	firstName,
		// 	lastName,
		// 	phone: phoneNumber || '',
		// 	address: '',
		// 	photoURL: photoURL || '',
		// };
		return {} as IUser;
	}

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

	getUserDisplay(user: IUser): string {
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

	// loginWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
	// 	return from(signInWithEmailAndPassword(this.auth, email, password));
	// }

	// forgetPassword(email: string): Observable<void> {
	// 	return from(
	// 		sendPasswordResetEmail(this.auth, email, {
	// 			url: this.appSettings.getUrlOrigin() + '/auth/login?passwordChanged=true',
	// 		}),
	// 	);
	// }

	// logout(): Observable<void> {
	// 	return from(signOut(this.auth));
	// }

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
