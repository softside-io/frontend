import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppSettingsService } from 'projects/web/src/app/shared/services/app-settings.service';
import { StorageAccessorService } from 'projects/web/src/app/shared/services/storage-accessor.service';
import { ImageUploadService } from 'projects/web/src/app/shared/services/image-upload.service';
import {
	AuthConfirmEmailDto,
	AuthForgotPasswordDto,
	AuthRegisterLoginDto,
	AuthResendEmailDto,
	AuthResetPasswordDto,
	AuthService,
	AuthUpdateDto,
	FileType,
	LoginResponseType,
	StatusEnum,
	User,
} from 'projects/api';

@Injectable({
	providedIn: 'root',
})
export class SessionService {
	storage = inject(StorageAccessorService);
	authService = inject(AuthService);
	appSettings = inject(AppSettingsService);
	activatedRoute = inject(ActivatedRoute);
	router = inject(Router);
	imageService = inject(ImageUploadService);
	userIsGettingDeleted$ = new Subject<boolean>();
	loggedInWithGoogle = signal(false);
	loggedInWithPassword = signal(false);
	private loggedInUserSubject = new BehaviorSubject<User | null>(null);
	loggedInUser$ = this.loggedInUserSubject.asObservable();

	get currentUser(): User | null {
		return this.loggedInUserSubject.value;
	}

	constructor() {
		this.getSession();
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

	getUserNames(displayName: string): { firstName: string; lastName: string; } {
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

	registerNewAccount(email: string, password: string): Observable<void> {
		const newUser: AuthRegisterLoginDto = {
			email,
			password,
		};

		return this.authService.register(newUser).pipe(
			tap({
				next: () => this.router.navigateByUrl(`/auth/login`, { replaceUrl: true, state: { registered: true } }),
			}),
		);
	}

	resendEmail(): Observable<void> {
		if (!this.currentUser) {
			throw new Error('User is not logged in');
		}

		const dto: AuthResendEmailDto = {
			email: this.currentUser.email,
		};

		return this.authService.sendVerificationEmail(dto).pipe(
			tap({
				next: () => {
					// do i need it?
				},
			}),
		);
	}

	confirmEmail(hash: string): Observable<void> {
		const dto: AuthConfirmEmailDto = {
			hash,
		};

		return this.authService.confirmEmail(dto).pipe(
			tap({
				next: () => {
					if (this.isLoggedIn()) {
						const currentUser = this.getSession();

						this.setSession({
							...currentUser,
							user: {
								...currentUser.user,
								status: {
									id: 1,
								},
							},
						});

						this.router.navigateByUrl('/', { replaceUrl: true, state: { verified: true } });
					}

					this.router.navigateByUrl('/auth/login', { replaceUrl: true, state: { verified: true } });
				},
			}),
		);
	}

	// loginWithGoogle(): Observable<UserCredential> {
	// 	return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
	// }

	loginWithEmailAndPassword(email: string, password: string): Observable<LoginResponseType> {
		return this.authService.login({ email, password }).pipe(
			tap({
				next: (session) => {
					this.setSession(session);
					const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
					this.router.navigateByUrl(returnUrl, { replaceUrl: true });
				},
			}),
		);
	}

	refreshToken(): Observable<Omit<LoginResponseType, 'user'>> {
		return this.authService.refresh().pipe(
			tap({
				next: (session) => {
					const currentSession = this.storage.getLocalStorage<LoginResponseType>(
						'session',
						true,
					) as LoginResponseType;
					this.storage.setLocalStorage('session', { ...currentSession, ...session }, true);
				},
			}),
		);
	}

	setSession(session: LoginResponseType): void {
		this.storage.setLocalStorage('session', session, true);

		this.loggedInUserSubject.next(session.user);
	}

	updateUserProfileImage(photo: FileType): Observable<void> {
		return this.authService.update({ photo }).pipe(
			tap({
				next: () => {
					this.setSession({
						...this.getSession(),
						user: {
							...this.currentUser!,
							photo,
						},
					});
				},
			}),
		);
	}

	updateUserProfile(user: AuthUpdateDto): Observable<void> {
		return this.authService.update(user).pipe(
			tap({
				next: () => {
					this.setSession({
						...this.getSession(),
						user: {
							...this.currentUser!,
							...user,
						},
					});
				},
			}),
		);
	}

	isLoggedIn(): boolean {
		const session = this.getSession();

		return session !== null;
	}

	getSession(): LoginResponseType {
		const session = this.storage.getLocalStorage<LoginResponseType>('session', true) as LoginResponseType;

		if (session) {
			this.loggedInUserSubject.next(session.user);

		}

		return session;
	}

	isVerified(): boolean {
		const session = this.getSession();

		if (!session.user) {
			return false;
		}

		return session.user.status.id == StatusEnum.ACTIVE;
	}

	forgetPassword(dto: AuthForgotPasswordDto): Observable<void> {
		return this.authService.forgotPassword(dto);
	}

	resetPassword(dto: AuthResetPasswordDto): Observable<void> {
		return this.authService.resetPassword(dto).pipe(
			tap({
				next: () => {
					this.router.navigateByUrl('/auth/login', { replaceUrl: true, state: { resetted: true } });
				},
			}),
		);
	}

	logout(): Observable<void> {
		return this.authService.logout().pipe(
			tap({
				next: () => {
					this.clearSession();
				},
			}),
		);
	}

	clearSession(): void {
		this.storage.removeLocalStorageKey('session');
		this.router.navigate(['/auth']);
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
	// TODO: Refactor components
	followup<T>(
		observable: Observable<T>,
		next: ((value: T) => void) | undefined,
		destroy: DestroyRef,
	): Subscription | null {
		return observable.pipe(takeUntilDestroyed(destroy)).subscribe({
			next,
		});
	}
}
