import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';
import {
	IonContent,
	IonCard,
	IonCardHeader,
	IonIcon,
	IonCardTitle,
	IonCardContent,
	IonText,
	IonRow,
	IonCol,
	IonButton,
	IonButtons,
} from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';

import { Helpers } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from '../../services/session.service';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AsyncRefDirective } from '../../../shared/directives/async-ref.directive';

@Component({
	selector: 'app-verify-email',
	templateUrl: './verify-email.component.html',
	styleUrls: ['./verify-email.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgIf,
		IonContent,
		IonCard,
		IonCardHeader,
		IonIcon,
		IonCardTitle,
		IonCardContent,
		IonText,
		IonRow,
		IonCol,
		IonButton,
		AsyncRefDirective,
		IonButtons,
	],
})
export class ConfirmEmailComponent implements OnInit {
	protected sessionService = inject(SessionService);
	protected activatedRoute = inject(ActivatedRoute);
	protected router = inject(Router);
	protected destroyRef = inject(DestroyRef);
	protected _appToast = inject(AppToastService);

	signOut$: Subscription | null = null;
	confirmEmail$: Subscription | null = null;
	resendEmail$: Subscription | null = null;

	user = this.sessionService.currentUser;

	constructor() {
		addIcons({
			mailOutline,
		});
	}

	ngOnInit(): void {
		const hash = this.activatedRoute.snapshot.queryParams['hash'];

		if (hash) {
			this.confirmEmail$ = Helpers.takeOne(
				this.sessionService.confirmEmail({ hash }),
				undefined,
				this.destroyRef,
			);
		}
	}

	resendEmail(): void {
		this.resendEmail$ = Helpers.takeOne(this.sessionService.resendEmail(), this.onSuccess, this.destroyRef);
	}

	onSuccess = (): void => {
		this._appToast.createToast(
			`Verification email sent! Please check your inbox to complete the registration process.`,
			5000,
			{
				color: 'success',
				size: 'medium',
			},
		);
	};

	logout(): void {
		this.signOut$ = Helpers.takeOne(this.sessionService.logout(), undefined, this.destroyRef);
	}
}
