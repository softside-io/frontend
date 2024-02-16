import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
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
} from '@ionic/angular/standalone';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';
import { ConvertToForm, FB } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from '../../services/session.service';
import { SSButtonComponent } from '../../../../../../softside/ui-sdk/lib/elements/action/button/button.component';
import { AsyncRefDirective } from '../../../shared/directives/async-ref.directive';
import { SSPasswordComponent } from '../../../../../../softside/ui-sdk/lib/components/inputs/password/password.component';
import { SSEmailComponent } from '../../../../../../softside/ui-sdk/lib/components/inputs/email/email.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
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
		SSEmailComponent,
		SSPasswordComponent,
		IonButton,
		AsyncRefDirective,
		SSButtonComponent,
		IonButtons,
		RouterLink,
	],
})
export class LoginComponent implements OnInit {
	private router = inject(Router);
	private sessionService = inject(SessionService);
	private _appToast = inject(AppToastService);
	private destroyRef = inject(DestroyRef);

	form: LoginForm = FB.group({
		email: FB.string(),
		password: FB.string(),
	});

	login$: Subscription | null = null;
	loginWithGoogle$: Subscription | null = null;

	ngOnInit(): void {
		const registered = this.router.getCurrentNavigation()?.extras.state?.['registered'];
		const verified = this.router.getCurrentNavigation()?.extras.state?.['verified'];
		const resetted = this.router.getCurrentNavigation()?.extras.state?.['resetted'];
		const changedPassword = this.router.getCurrentNavigation()?.extras.state?.['changedPassword'];

		if (registered) {
			this._appToast.createToast(
				`Verification email sent! Please check your inbox to complete the registration process.`,
				5000,
				{
					color: 'success',
					size: 'medium',
				},
			);
		}

		if (verified) {
			this._appToast.createToast(`Your email has been successfully verified!`, 5000, {
				color: 'success',
				size: 'medium',
			});
		}

		if (resetted) {
			this._appToast.createToast(`Your password has been successfully changed!`, 5000, {
				color: 'success',
				size: 'medium',
			});
		}

		if (changedPassword) {
			this._appToast.createToast(`Your password has been successfully updated!`, 5000, {
				color: 'success',
				size: 'medium',
			});
		}
	}

	submitRecord(): void {
		if (this.form.invalid) {
			return;
		}

		const { email, password } = this.form.getRawValue();

		this.login$ = this.sessionService.followup(
			this.sessionService.loginWithEmailAndPassword({ email, password }),
			undefined,
			this.destroyRef,
		);
	}

	loginWithGoogle(): void {
		// this.loginWithGoogle$ = this.sessionService.followup(
		// 	this.sessionService.loginWithGoogle(),
		// 	undefined,
		// 	this.destroyRef,
		// );
	}
}

type Login = {
	email: string;
	password: string;
};
type LoginForm = ConvertToForm<Login>;
