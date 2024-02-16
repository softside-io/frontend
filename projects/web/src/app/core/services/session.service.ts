import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppSettingsService } from 'projects/web/src/app/shared/services/app-settings.service';
import { StorageAccessorService } from 'projects/web/src/app/shared/services/storage-accessor.service';
import {
	AuthConfirmEmailDto,
	AuthEmailLoginDto,
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
import { BroadcastChannels, BroadcastEventEnum, BroadcastService } from '@softside/ui-sdk/lib/shared';

@Injectable({
	providedIn: 'root',
})
export class SessionService {
	storage = inject(StorageAccessorService);
	authService = inject(AuthService);
	broadcastService = inject(BroadcastService);
	appSettings = inject(AppSettingsService);
	activatedRoute = inject(ActivatedRoute);
	router = inject(Router);
	userIsGettingDeleted$ = new Subject<boolean>();
	loggedInWithGoogle = signal(false);
	loggedInWithPassword = signal(true);
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

	// getUserNames(displayName: string): { firstName: string; lastName: string; } {
	// 	const name = displayName?.split(' ');

	// 	let firstName = displayName || '',
	// 		lastName = '';

	// 	if (name && name?.length > 1) {
	// 		firstName = name[0];
	// 		name.shift();
	// 		lastName = name.join(' ');
	// 	}

	// 	return {
	// 		firstName,
	// 		lastName,
	// 	};
	// }

	getUserDisplay(user: User): string {
		let name = '';

		if (user.firstName) {
			name = user.firstName + ' ' + user.lastName;
		} else if (user.email) {
			name = user.email;
		}

		return name;
	}

	registerNewAccount(newUser: AuthRegisterLoginDto): Observable<void> {
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

		return this.authService.sendVerificationEmail(dto);
	}

	confirmEmail(hashDto: AuthConfirmEmailDto): Observable<void> {
		return this.authService.confirmEmail(hashDto).pipe(
			tap({
				next: () => {
					if (this.isLoggedIn()) {
						const session = this.getSession();

						this.setSession({
							...session,
							user: {
								...session.user,
								status: {
									id: StatusEnum.ACTIVE,
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

	loginWithEmailAndPassword(loginDto: AuthEmailLoginDto): Observable<LoginResponseType> {
		return this.authService.login(loginDto).pipe(
			tap({
				next: (session) => {
					this.broadcastService.sendMessage(BroadcastChannels.AUTH_CHANNEL, {
						action: BroadcastEventEnum.LOGIN,
						data: { session },
					});
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
		this.broadcastService.sendMessage(BroadcastChannels.AUTH_CHANNEL, {
			action: BroadcastEventEnum.SESSION,
			data: { session },
		});
	}

	updateLoggedInUser(user: User): void {
		this.loggedInUserSubject.next(user);
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
		this.broadcastService.sendMessage(BroadcastChannels.AUTH_CHANNEL, { action: BroadcastEventEnum.LOGOUT });
	}

	// linkUser(user: User, newPassword: string): Observable<UserCredential> {
	// 	const creds = EmailAuthProvider.credential(user.email!, newPassword);

	// 	return from(linkWithCredential(user, creds));
	// }

	changePassword(changePasswordDto: Pick<AuthUpdateDto, 'password' | 'oldPassword'>): Observable<void> {
		return this.authService.update(changePasswordDto).pipe(
			tap({
				next: () => {
					this.clearSession();
					this.router.navigateByUrl('/auth/login', { replaceUrl: true, state: { changedPassword: true } });
				},
			}),
		);
	}

	deleteUser(): Observable<void> {
		return this.authService.delete().pipe(
			tap({
				next: () => {
					this.clearSession();
					this.router.navigate(['/auth']);
				},
			}),
		);
	}

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
