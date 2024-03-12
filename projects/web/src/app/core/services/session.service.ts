import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { AppSettingsService } from 'projects/web/src/app/shared/services/app-settings.service';
import {
	AuthConfirmEmailDto,
	AuthEmailLoginDto,
	AuthForgotPasswordDto,
	AuthGoogleLoginDto,
	AuthRegisterLoginDto,
	AuthResendEmailDto,
	AuthResetPasswordDto,
	AuthService,
	AuthUpdateDto,
	FileType,
	SessionType,
	StatusEnum,
	User,
} from 'projects/api';
import {
	BroadcastChannels,
	BroadcastEventEnum,
	BroadcastService,
	SecureStorageService,
} from '@softside/ui-sdk/lib/shared';
import { Helpers } from '@softside/ui-sdk/lib/_utils';

type Auth = Omit<SessionType, 'user'>;

@Injectable({
	providedIn: 'root',
})
export class SessionService {
	storage = inject(SecureStorageService);
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
	private authSubject = new BehaviorSubject<Auth | null>(null);
	authSubject$ = this.authSubject.asObservable();
	// private socialAuthService = inject(SocialAuthService);

	get currentUser(): User | null {
		return this.loggedInUserSubject.value;
	}

	get auth(): Auth | null {
		return this.authSubject.value;
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
						this.setSession({
							...this.auth!,
							user: {
								...this.currentUser!,
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

	loginWithGoogle(googleDto: AuthGoogleLoginDto): Observable<SessionType> {
		return this.authService.login2(googleDto).pipe(
			tap({
				next: (session) => this.onLogin(session),
			}),
		);
	}

	loginWithEmailAndPassword(loginDto: AuthEmailLoginDto): Observable<SessionType> {
		return this.authService.login(loginDto).pipe(
			tap({
				next: (session) => this.onLogin(session),
			}),
		);
	}

	onLogin(session: SessionType): void {
		this.setSessionInStorage(session);
		this.broadcastService.sendMessage(BroadcastChannels.AUTH_CHANNEL, {
			action: BroadcastEventEnum.LOGIN,
			data: { session },
		});
	}

	refreshToken(): Observable<Auth> {
		return this.authService.refresh();
	}

	setSession(session: SessionType): void {
		this.broadcastService.sendMessage(BroadcastChannels.AUTH_CHANNEL, {
			action: BroadcastEventEnum.SESSION,
			data: { session },
		});

		this.setSessionInStorage(session);
	}

	updateSession(session: SessionType | null): void {
		if (session == null) {
			this.updateAuth(null);
			this.updateLoggedInUser(null);

			return;
		}

		this.updateAuth({
			token: session.token,
			refreshToken: session.refreshToken,
			tokenExpires: session.tokenExpires,
		});

		this.updateLoggedInUser(session.user);
	}

	updateAuth(auth: Auth | null): void {
		this.authSubject.next(auth);
	}

	updateLoggedInUser(user: User | null): void {
		this.loggedInUserSubject.next(user);
	}

	updateUserProfileImage(photo: FileType): Observable<User> {
		return this.authService.update({ photo }).pipe(
			tap({
				next: (user: User) => {
					this.setSession({
						...this.auth!,
						user,
					});
				},
			}),
		);
	}

	updateUserProfile(user: AuthUpdateDto): Observable<User> {
		return this.authService.update(user).pipe(
			tap({
				next: (user: User) => {
					this.setSession({
						...this.auth!,
						user,
					});
				},
			}),
		);
	}

	isLoggedIn(): boolean {
		return !!this.auth?.token;
	}

	getSessionFromStorage(): Subscription {
		return Helpers.takeOne(this.storage.get<SessionType>('session'), (session: SessionType | null) => {
			if (!session) {
				return;
			}

			this.updateSession(session);
		});
	}

	setSessionInStorage(session: SessionType): void {
		Helpers.takeOne(this.storage.set('session', session));
	}

	isVerified(): boolean {
		return this.currentUser?.status.id === StatusEnum.ACTIVE;
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
		Helpers.takeOne(this.storage.remove('session'));
		this.broadcastService.sendMessage(BroadcastChannels.AUTH_CHANNEL, { action: BroadcastEventEnum.LOGOUT });
	}

	// linkUser(user: User, newPassword: string): Observable<UserCredential> {
	// 	const creds = EmailAuthProvider.credential(user.email!, newPassword);

	// 	return from(linkWithCredential(user, creds));
	// }

	changePassword(changePasswordDto: Pick<AuthUpdateDto, 'password' | 'oldPassword'>): Observable<User> {
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
}
