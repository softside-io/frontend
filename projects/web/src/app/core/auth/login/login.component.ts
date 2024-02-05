import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';
import { ConvertToForm, FB } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from '../../services/session.service';
import { LoginResponseType } from '../../../shared/models/user.model';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
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

		if (registered) {
			this._appToast.createToast(`Verification email sent! Please check your inbox to complete the registration process.`, 5000, {
				color: 'success',
				size: 'medium',
			});
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
	}

	submitRecord(): void {
		if (this.form.invalid) {
			return;
		}

		const { email, password } = this.form.getRawValue();
		this.login$ = this.loginFollowUp(this.sessionService.loginWithEmailAndPassword(email, password));
	}

	loginWithGoogle(): void {
		// this.loginWithGoogle$ = this.loginFollowUp(this.authService.loginWithGoogle());
	}

	loginFollowUp(login: Observable<LoginResponseType>): Subscription | null {
		return login.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
	}

	ngOnDestroy(): void {
		this.login$?.unsubscribe();
		this.loginWithGoogle$?.unsubscribe();
	}
}

type Login = {
	email: string;
	password: string;
};
type LoginForm = ConvertToForm<Login>;
