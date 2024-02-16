import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import {
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonRow,
	IonCol,
	IonButton,
	IonButtons,
	IonText,
} from '@ionic/angular/standalone';

import { ConvertToForm, FB } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from '../../services/session.service';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AsyncRefDirective } from '../../../shared/directives/async-ref.directive';
import { SSConfirmPasswordComponent } from '../../../../../../softside/ui-sdk/lib/components/composed/confirm-password/confirm-password.component';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonRow,
		IonCol,
		ReactiveFormsModule,
		SSConfirmPasswordComponent,
		IonButton,
		AsyncRefDirective,
		IonButtons,
		IonText,
		RouterLink,
	],
})
export class ResetPasswordComponent implements OnInit {
	protected router = inject(Router);
	protected sessionService = inject(SessionService);
	protected _appToast = inject(AppToastService);
	protected activatedRoute = inject(ActivatedRoute);
	protected hash = '';
	protected destroyRef = inject(DestroyRef);

	form: ConvertToForm<PasswordGroup> = FB.group({
		confirmPasswordGroup: FB.group({
			password: FB.string(),
			confirmPassword: FB.string(),
		}),
	});

	reset$: Subscription | null = null;

	ngOnInit(): void {
		this.hash = this.activatedRoute.snapshot.queryParams['hash'];
	}

	resetFollowUp(reset: Observable<void>): Subscription | null {
		return reset.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
	}

	submitRecord(): void {
		if (this.form.invalid) {
			return;
		}

		const {
			confirmPasswordGroup: { password },
		} = this.form.getRawValue();

		this.reset$ = this.resetFollowUp(this.sessionService.resetPassword({ hash: this.hash, password }));
	}
}

type PasswordGroup = {
	confirmPasswordGroup: {
		password: string;
		confirmPassword: string;
	};
};
