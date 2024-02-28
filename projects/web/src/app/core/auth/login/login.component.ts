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
	IonText,
} from '@ionic/angular/standalone';
import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';
import { ConvertToForm, FB, Helpers } from '@softside/ui-sdk/lib/_utils';

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
		GoogleSigninButtonModule,
		IonText,
	],
})
export class LoginComponent implements OnInit {
	private router = inject(Router);
	private sessionService = inject(SessionService);
	private _appToast = inject(AppToastService);
	private destroyRef = inject(DestroyRef);
	public socialAuthState = inject(SocialAuthService);

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

		this.listenForGoogleSignIn();
	}

	listenForGoogleSignIn(): void {
		Helpers.takeOne(
			this.socialAuthState.authState,
			(user: SocialUser) => {
				if (!user) {
					return;
				}

				this.invokeLogin(user);
			},
			this.destroyRef,
		);
	}

	invokeLogin(user: SocialUser | { email: string; password: string }): void {
		if (user instanceof SocialUser) {
			this.login$ = Helpers.takeOne(this.sessionService.loginWithGoogle(user), undefined, this.destroyRef);
		} else {
			this.login$ = Helpers.takeOne(
				this.sessionService.loginWithEmailAndPassword(user),
				undefined,
				this.destroyRef,
			);
		}
	}

	submitRecord(): void {
		if (this.form.invalid) {
			return;
		}

		const { email, password } = this.form.getRawValue();

		this.invokeLogin({ email, password });
	}
}

type Login = {
	email: string;
	password: string;
};
type LoginForm = ConvertToForm<Login>;
