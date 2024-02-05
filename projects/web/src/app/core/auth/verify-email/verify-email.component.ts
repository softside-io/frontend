import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SessionService } from '../../services/session.service';

@Component({
	selector: 'app-verify-email',
	templateUrl: './verify-email.component.html',
	styleUrls: ['./verify-email.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent implements OnDestroy, OnInit {
	protected sessionService = inject(SessionService);
	protected activatedRoute = inject(ActivatedRoute);
	protected router = inject(Router);
	protected destroyRef = inject(DestroyRef);

	signOut$: Subscription | null = null;
	verifyEmail$: Subscription | null = null;

	user = this.sessionService.currentUser!;

	ngOnInit(): void {
		const hash = this.activatedRoute.snapshot.queryParams['hash'];

		if (hash) {
			this.verifyEmail$ = this.verifyFollowUp(this.sessionService.verifyEmail(hash));
		}
	}

	verifyFollowUp(verify: Observable<void>): Subscription | null {
		return verify.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
	}

	verifyEmail(): void {
		// this.verifyEmail$ = this.authService
		// 	.userProvider((user: AuthUser) => {
		// 		return this.authService.sendVerificationEmail(user!);
		// 	})
		// 	.subscribe();
		// TODO: Create API endpoint to resend verification email.
	}

	logout(): void {
		this.signOut$ = this.sessionService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
	}

	ngOnDestroy(): void {
		this.verifyEmail$?.unsubscribe();
	}
}
