import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ConvertToForm, FB } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from '../../services/session.service';
import { AppToastService } from '../../../shared/services/app-toast.service';

@Component({
	selector: 'app-forget-password',
	templateUrl: './forget-password.component.html',
	styleUrls: ['./forget-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPasswordComponent {
	private sessionService = inject(SessionService);
	private _appToast = inject(AppToastService);
	private destroyRef = inject(DestroyRef);

	form: ConvertToForm<{ email: string }> = FB.group({
		email: FB.string(),
	});

	forget$: Subscription | null = null;

	forgetFollowUp(forget: Observable<void>): Subscription | null {
		return forget.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: () => {
				this._appToast.createToast(`An email has been sent to ${this.form.get('email')}`, 5000, { color: 'secondary', size: 'medium' });
			},
		});
	}

	submitRecord(): void {
		if (this.form.invalid) {
			return;
		}

		const { email } = this.form.getRawValue();

		// TODO: Refactor later
		// this.followup(
		// 	this.sessionService.forgetPassword({ email }),
		// 	() => {
		// 		console.log('test');
		// 	},
		// 	this.destroyRef,
		// );

		this.forget$ = this.forgetFollowUp(this.sessionService.forgetPassword({ email }));
	}
}
