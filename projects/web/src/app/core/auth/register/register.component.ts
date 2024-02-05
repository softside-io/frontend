import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';
import { ConvertToForm, FB } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from '../../services/session.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
	protected sessionService = inject(SessionService);
	protected _appToast = inject(AppToastService);
	protected destroyRef = inject(DestroyRef);

	form: RegisterForm = FB.group({
		email: FB.string(''),
		confirmPasswordGroup: FB.group({
			password: FB.string(''),
			confirmPassword: FB.string(''),
		}),
	});

	register$: Subscription | null = null;

	submitRecord(): void {
		if (this.form.invalid) {
			return;
		}

		const {
			email,
			confirmPasswordGroup: { password },
		} = this.form.getRawValue();

		this.register$ = this.registerFollowUp(this.sessionService.registerNewAccount(email, password));
	}

	registerFollowUp(register: Observable<void>): Subscription | null {
		return register.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
	}
}

type Register = {
	email: string;
	confirmPasswordGroup: {
		password: string;
		confirmPassword: string;
	};
};
type RegisterForm = ConvertToForm<Register>;
