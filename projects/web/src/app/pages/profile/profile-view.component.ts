import {
	Component,
	ViewChild,
	inject,
	ChangeDetectionStrategy,
	OnDestroy,
	ElementRef,
	signal,
	DestroyRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, switchMap, take, tap } from 'rxjs';
import { ToggleCustomEvent } from '@ionic/core';
import {
	IonModal,
	IonContent,
	IonCard,
	IonCardContent,
	IonList,
	IonItem,
	IonGrid,
	IonRow,
	IonCol,
	IonText,
	IonAvatar,
	IonFab,
	IonFabButton,
	IonIcon,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonToggle,
	IonAlert,
} from '@ionic/angular/standalone';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { ReactiveFormsModule } from '@angular/forms';
import { NgLetModule } from 'ng-let';
import { AsyncPipe } from '@angular/common';

import { SessionService } from 'projects/web/src/app/core/services/session.service';
import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';
import { ConvertToForm, FB } from '@softside/ui-sdk/lib/_utils';
import { AuthService, AuthUpdateDto, FileType, FilesService, User } from 'projects/api';
import { AsyncRefDirective } from '@softside/ui-sdk/lib/shared/directives/async-ref/async-ref.directive';

import { ThemeService } from '../../core/services/theme.service';
import { SSPasswordComponent } from '../../../../../softside/ui-sdk/lib/components/inputs/password/password.component';
import { SSSubmitButtonComponent } from '../../../../../softside/ui-sdk/lib/components/buttons/submit/submit.component';
import { SSConfirmPasswordComponent } from '../../../../../softside/ui-sdk/lib/components/composed/confirm-password/confirm-password.component';
import { SSTextareaComponent } from '../../../../../softside/ui-sdk/lib/elements/keyin/textarea/textarea.component';
import { SSEmailComponent } from '../../../../../softside/ui-sdk/lib/components/inputs/email/email.component';
import { SSTextComponent } from '../../../../../softside/ui-sdk/lib/components/inputs/text/text.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
	selector: 'app-profile-view',
	templateUrl: './profile-view.component.html',
	styleUrls: ['./profile-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		ImageCropperModule,
		SSTextComponent,
		SSEmailComponent,
		SSTextareaComponent,
		SSPasswordComponent,
		SSConfirmPasswordComponent,
		SSSubmitButtonComponent,
		IonContent,
		IonCard,
		IonCardContent,
		IonList,
		IonItem,
		IonGrid,
		IonRow,
		IonCol,
		IonText,
		IonAvatar,
		IonFab,
		IonFabButton,
		IonIcon,
		IonModal,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonButton,
		IonTitle,
		IonToggle,
		IonAlert,
		AsyncRefDirective,
		ReactiveFormsModule,
		PageHeaderComponent,
		NgLetModule,
		AsyncPipe,
	],
})
export class ProfileViewComponent implements OnDestroy {
	@ViewChild('modalChangePassword') modalChangePassword!: IonModal;
	@ViewChild('modalVerifyEmail') modalValidatePassword!: IonModal;
	@ViewChild('modalImageCrop') modalImageCrop!: IonModal;
	@ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

	authService = inject(AuthService);
	sessionService = inject(SessionService);
	router = inject(Router);
	_appToast = inject(AppToastService);
	theme = inject(ThemeService);
	canSave = signal(false);
	fileService = inject(FilesService);
	private destroyRef = inject(DestroyRef);

	saveProfile$: Subscription | null = null;
	deleteUser$: Subscription | null = null;
	modifyPassword$: Subscription | null = null;
	validatePassword$: Subscription | null = null;
	uploadingImage$: Subscription | null = null;

	imageChangedEvent: Event | null = null;
	imageCropped: ImageCroppedEvent | null = null;
	imageCroppedName = '';

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

	profileForm: ConvertToForm<Profile> = FB.group({
		email: FB.string(),
		address: FB.string(),
		firstName: FB.string(),
		lastName: FB.string(),
		phone: FB.string(),
	});

	formChangePassword: ConvertToForm<PasswordGroup> = FB.group({
		confirmPasswordGroup: FB.group({
			password: FB.string(),
			confirmPassword: FB.string(),
		}),
	});

	formValidatePassword: ConvertToForm<{ password: string; }> = FB.group({
		password: FB.string(),
	});

	user$ = this.sessionService.loggedInUser$.pipe(
		tap({
			next: (user: User | null) => {
				this.profileForm.patchValue({
					firstName: user?.firstName,
					lastName: user?.lastName,
					email: user?.email,
					phone: user?.phone,
					address: user?.address,
				});
			},
		}),
	);;

	constructor() {
		addIcons({
			camera,
		});
	}

	uploadFile(): void {

		// Now you have a File object with a custom name that you can use for uploads, etc.
		this.uploadingImage$ = this.fileService
			.uploadFile({
				file: new File([this.imageCropped?.blob as Blob], this.imageCroppedName, { type: this.imageCropped?.blob?.type }),
			})
			.pipe(
				take(1),
				switchMap((file: FileType) => {

					return this.sessionService.updateUserProfileImage(file);
				}),
			)
			.subscribe({
				next: () => {
					this.modalImageCrop.dismiss();
					this._appToast.createToast('Your profile image has been updated successfully', 0, {
						color: 'success',
						size: 'medium',
					});
				},
				error: (_error: Error) => {
					this._appToast.createToast('Check file size. Limit: 2mb. Try resizing or choose another image', 5000, {
						color: 'danger',
						size: 'medium',
					});
				},
			});
	}

	submitRecord(user: User): void {
		if (this.profileForm.invalid) {
			return;
		}

		const { firstName, lastName, phone, address } = this.profileForm.getRawValue();
		const updatedUser: AuthUpdateDto = { ...user, firstName, lastName, phone, address };

		this.saveProfile$ = this.sessionService.followup(
			this.sessionService.updateUserProfile(updatedUser),
			() => {
				this._appToast.createToast('Your profile has been successfully saved', 0, {
					color: 'success',
					size: 'small',
				});
			},
			this.destroyRef,
		);
	}

	deleteUser(): void {
		// this.deleteUser$ = this.sessionService
		// 	.userProvider((user: AuthUser): Observable<void> => {
		// 		if (!user) {
		// 			return of(undefined);
		// 		}
		// 		return this.sessionService.deleteUser(user);
		// 	})
		// 	.subscribe({
		// 		next: () => {
		// 			this.router.navigateByUrl('auth/login', { replaceUrl: true });
		// 		},
		// 		error: (_error: Error) => {
		// 			this._appToast.createToast('Opps! Please try gain later.', 2000, { color: 'danger', size: 'small' });
		// 		},
		// 	});
	}

	setResult(event: Event): void {
		console.log(`Dismissed with role: ${(event as ToggleCustomEvent).detail}`);
	}

	confirmChangePassword(): void {
		if (this.formChangePassword.invalid) {
			return;
		}

		const {
			confirmPasswordGroup: { password },
		} = this.formChangePassword.getRawValue();

		if (this.sessionService.loggedInWithGoogle() && !this.sessionService.loggedInWithPassword()) {
			this.linkAccount(password);
		} else {
			this.updatePassword(password);
		}
	}

	modifyPassword(): void {
		this.sessionService.loggedInWithPassword()
			? this.modalValidatePassword.present()
			: this.modalChangePassword.present();
	}

	confirmValidatePassword(): void {
		if (this.formValidatePassword.invalid) {
			return;
		}

		const { password } = this.formValidatePassword.getRawValue();
		console.log(password);

		// this.validatePassword$ = this.sessionService
		// 	.userProvider((user: AuthUser) => {
		// 		if (!user) {
		// 			return of(undefined);
		// 		}

		// 		return this.sessionService.validatePassword(user, password);
		// 	})
		// 	.subscribe({
		// 		next: () => {
		// 			this.modalValidatePassword.dismiss();
		// 			this.modalChangePassword.present();
		// 		},
		// 		error: (_error: Error) => {
		// 			this._appToast.createToast('Opps! Incorrect password.', 2000, { color: 'danger', size: 'small' });
		// 		},
		// 	});
	}

	private updatePassword(_currentPassword: string): void {
		// this.modifyPassword$ = this.sessionService
		// 	.userProvider((user: AuthUser) => {
		// 		if (!user) {
		// 			return of(undefined);
		// 		}
		// 		return this.sessionService.updatePassword(user, currentPassword);
		// 	})
		// 	.subscribe({
		// 		next: () => {
		// 			this._appToast.createToast('Your password has been successfully updated!', 2000, {
		// 				color: 'success',
		// 				size: 'medium',
		// 			});
		// 			this.modalChangePassword.dismiss();
		// 			// this.sessionService.logout().subscribe((): void => {
		// 			// 	this.router.navigateByUrl('auth/login', { replaceUrl: true });
		// 			// });
		// 		},
		// 		error: (_error: Error) => {
		// 			this._appToast.createToast('Opps! Please try gain later.', 2000, { color: 'danger', size: 'small' });
		// 		},
		// 	});
	}

	private linkAccount(_password: string): void {
		// this.modifyPassword$ = this.sessionService
		// 	.userProvider((user: unknown | null) => {
		// 		if (!user) {
		// 			return of(null);
		// 		}
		// 		return this.sessionService.linkUser(user, password);
		// 	})
		// 	.subscribe({
		// 		next: (_creds: UserCredential | null) => {
		// 			this.sessionService.loggedInWithPassword.set(true);
		// 			this.modalChangePassword.dismiss();
		// 		},
		// 		error: () => null,
		// 	});
	}

	public fileChangeEvent(event: Event): void {
		this.imageChangedEvent = event;
		const element = this.inputField.nativeElement;
		const path = element.value;
		const file: File | null = (element.files?.length && element.files[0]) || null;

		if (!path || !file) {
			return;
		}

		this.imageCroppedName = file?.name;

		const extension = path.match(/\.([^\.]+)$/)![1].toLowerCase();

		if (file.size / 1024 / 1024 >= 5 || !(extension == 'jpg' || extension == 'png' || extension == 'jpeg')) {
			this.onLoadImageFailed();
			this.clearImageData();

			return;
		}

		this.modalImageCrop.present();
	}

	onImageCropped(event: ImageCroppedEvent): void {
		this.imageCropped = event;
	}

	onImageLoaded(): void {
		this.canSave.set(true);
	}

	onLoadImageFailed(): void {
		this.modalImageCrop.dismiss();

		this._appToast.createToast('Opps! Incorrect image format or size too large', 2000, {
			color: 'danger',
			size: 'small',
		});
	}

	clearImageData(): void {
		this.inputField.nativeElement.value = '';
		this.imageCropped = null;
		this.imageChangedEvent = null;
	}

	ngOnDestroy(): void {
		this.saveProfile$?.unsubscribe();
		this.deleteUser$?.unsubscribe();
		this.modifyPassword$?.unsubscribe();
		this.validatePassword$?.unsubscribe();
		this.uploadingImage$?.unsubscribe();
	}
}

type Profile = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
};

type PasswordGroup = {
	confirmPasswordGroup: {
		password: string;
		confirmPassword: string;
	};
};
