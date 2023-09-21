import { Component, ViewChild, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { take, switchMap, tap } from 'rxjs/operators';
import { Auth, User, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { ToggleCustomEvent } from '@ionic/core';
import { IonModal } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { AuthUser, IUser } from 'projects/core-ui/src/app/shared/models/IUser.model';
import { AuthService } from 'projects/core-ui/src/app/core/services/auth.service';
import { environment } from 'projects/core-ui/src/environments/environment';
import { AppToastService } from 'projects/core-ui/src/app/shared/services/app-toast.service';

import { ImageUploadService } from '../../../shared/services/image-upload.service';
import { passwordMatchValidator } from '../../../shared/helpers/confirmed.validator';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
	selector: 'app-profile-view',
	templateUrl: './profile-view.component.html',
	styleUrls: ['./profile-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileViewComponent {
	@ViewChild('modalChangePassword') modalChangePassword!: IonModal;
	@ViewChild('modalVerifyEmail') modalValidatePassword!: IonModal;
	@ViewChild('modalImageCrop') modalImageCrop!: IonModal;
	@ViewChild('inputField') inputField!: HTMLInputElement;

	authService = inject(AuthService);
	auth = inject(Auth);
	router = inject(Router);
	_appToast = inject(AppToastService);
	theme = inject(ThemeService);
	fb = inject(NonNullableFormBuilder);
	cdr = inject(ChangeDetectorRef);

	saveProfile$: Subscription | null = null;
	deleteUser$: Subscription | null = null;
	modifyPassword$: Subscription | null = null;
	validatePassword$: Subscription | null = null;
	uploadingImage$: Subscription | null = null;

	imageChangedEvent: Event | null = null;
	imageCroped: ImageCroppedEvent | null = null;
	// ngAfterViewInit(): void {
	// 	this.inputField.addEventListener('input', () => {
	// 		console.log('test');
	// 	});
	// }

	alertButtons = [
		{
			text: 'Cancel',
			role: 'cancel',
			handler: (): void => {
				console.log('Cancel');
			},
		},
		{
			text: 'OK',
			role: 'confirm',
			handler: (): void => {
				this.deleteUser();
			},
		},
	];

	profileForm: FormGroup = this.fb.group({
		firstName: new FormControl('', [Validators.required]),
		lastName: new FormControl('', [Validators.required]),
		email: new FormControl({ disabled: true, value: '' }),
		phone: new FormControl(''),
		address: new FormControl(''),
	});

	formChangePassword: FormGroup = this.fb.group(
		{
			password: new FormControl<string>('', [Validators.required]),
			confirmPassword: new FormControl<string>('', [Validators.required]),
		},
		{ validators: passwordMatchValidator('password', 'confirmPassword') },
	);

	formValidatePassword: FormGroup = this.fb.group({
		currentPassword: new FormControl<string>('', [Validators.required]),
	});

	get firstNameError(): string {
		return this.authService.getError(this.profileForm.get('firstName') as FormControl<string>, 'First Name');
	}

	get lastNameError(): string {
		return this.authService.getError(this.profileForm.get('lastName') as FormControl<string>, 'Last Name');
	}

	get getChangePasswordError(): string {
		return this.authService.getError(this.formChangePassword.get('password') as FormControl<string>, 'Password');
	}

	get getChangeConfirmPasswordError(): string {
		return this.authService.getError(this.formChangePassword.get('confirmPassword') as FormControl<string>, 'Password');
	}

	get getValidatePasswordError(): string {
		return this.authService.getError(this.formValidatePassword.get('currentPassword') as FormControl<string>, 'Password');
	}

	imageUploadService = inject(ImageUploadService);

	$user = this.authService.currentUserProfile$.pipe(
		tap((user: IUser | null) => {
			this.profileForm.patchValue({
				firstName: user?.firstName,
				lastName: user?.lastName,
				email: user?.email,
				phone: user?.phone,
				address: user?.address,
			});
		}),
	);

	uploadFile(user: IUser): void {
		this.uploadingImage$ = this.imageUploadService
			.uploadImage(this.imageCroped!.blob as File, `${environment.profileCDNPath}${user.uid}`)
			.pipe(
				take(1),
				switchMap((photoURL: string) => {
					user.photoURL = photoURL;

					return this.authService.updateUser(user);
				}),
			)
			.subscribe({
				next: () => {
					this.modalImageCrop.dismiss();
				},
				error: (_error: Error) => {
					this._appToast.createToast('Image format not supported, or file size exceeds the 2mb limit!', 0);
				},
			});
	}

	submitRecord(user: IUser): void {
		if (this.profileForm.invalid) {
			this.profileForm.markAllAsTouched();

			return;
		}

		const { firstName, lastName, phone, address } = this.profileForm.value;
		const updatedUser = { ...user, firstName, lastName, phone, address };

		this.saveProfile$ = this.authService
			.updateUser(updatedUser)
			.pipe(take(1))
			.subscribe({
				next: () => {
					this._appToast.createToast('Your profile has been successfully saved', 0, {
						color: 'success',
						size: 'small',
					});
				},
				error: (_error: Error) => {
					this._appToast.createToast('Opps! Please try gain later.', 2000, { color: 'danger', size: 'small' });
				},
			});
	}

	deleteUser(): void {
		this.deleteUser$ = this.authService
			.userProvider((user: AuthUser): Observable<void> => {
				if (!user) {
					return of(undefined);
				}

				return this.authService.deleteUser(user);
			})
			.subscribe({
				next: () => {
					this.router.navigateByUrl('auth/login', { replaceUrl: true });
				},
				error: (_error: Error) => {
					this._appToast.createToast('Opps! Please try gain later.', 2000, { color: 'danger', size: 'small' });
				},
			});
	}

	setResult(event: Event): void {
		console.log(`Dismissed with role: ${(event as ToggleCustomEvent).detail}`);
	}

	confirmChangePassword(): void {
		if (this.formChangePassword.invalid) {
			this.formChangePassword.markAllAsTouched();

			return;
		}

		const { password } = this.formChangePassword.value;

		if (this.authService.loggedInWithGoogle() && !this.authService.loggedInWithPassword()) {
			this.linkAccount(password);
		} else {
			this.updatePassword(password);
		}

		this.modalChangePassword.dismiss();
	}

	modifyPassword(): void {
		this.authService.loggedInWithPassword() ? this.modalValidatePassword.present() : this.modalChangePassword.present();
	}

	confirmValidatePassword(): void {
		if (this.formValidatePassword.invalid) {
			this.formValidatePassword.markAllAsTouched();

			return;
		}

		const { currentPassword } = this.formValidatePassword.value;

		this.validatePassword$ = this.authService
			.userProvider((user: AuthUser) => {
				if (!user) {
					return of(undefined);
				}

				return this.authService.validatePassword(user, currentPassword);
			})
			.subscribe({
				next: () => {
					this.modalValidatePassword.dismiss();
					this.modalChangePassword.present();
				},
				error: (_error: Error) => {
					this._appToast.createToast('Opps! Incorrect password.', 2000, { color: 'danger', size: 'small' });
				},
			});
	}

	private updatePassword(currentPassword: string): void {
		this.modifyPassword$ = this.authService
			.userProvider((user: AuthUser) => {
				if (!user) {
					return of(undefined);
				}

				return this.authService.updatePassword(user, currentPassword);
			})
			.subscribe({
				next: () => {
					this._appToast.createToast('Your password has been successfully updated!', 2000, {
						color: 'success',
						size: 'medium',
					});

					this.authService.logout().subscribe((): void => {
						this.router.navigateByUrl('auth/login', { replaceUrl: true });
					});
				},
				error: (_error: Error) => {
					this._appToast.createToast('Opps! Please try gain later.', 2000, { color: 'danger', size: 'small' });
				},
			});
	}

	private linkAccount(password: string): void {
		this.modifyPassword$ = this.authService
			.userProvider((user: User | null) => {
				if (!user) {
					return of(null);
				}

				return this.authService.linkUser(user, password);
			})
			.subscribe({
				next: (_creds: UserCredential | null) => {
					this.authService.loggedInWithPassword.set(true);
				},
				error: () => null,
			});
	}

	public fileChangeEvent(event: Event): void {
		this.imageChangedEvent = event;
		this.modalImageCrop.present();
	}

	imageCropped(event: ImageCroppedEvent): void {
		this.imageCroped = event;
	}

	public loadImageFailed(): void {
		this.modalImageCrop.dismiss();

		this._appToast.createToast('Opps! Incorrect image format.', 2000, { color: 'danger', size: 'small' });
	}

	willDismiss(): void {
		this.cdr.detectChanges();
		this.imageChangedEvent = null;
		this.imageCroped = null;
	}
}