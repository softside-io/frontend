import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { SessionService } from '../../services/session.service';

@Component({
	selector: 'app-verify-email',
	templateUrl: './verify-email.component.html',
	styleUrls: ['./verify-email.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnDestroy {
	private sessionService = inject(SessionService);
	private router = inject(Router);

	signOut$: Subscription | null = null;
	verifyEmail$: Subscription | null = null;

	user$ = this.sessionService.currentUserProfile$;

	verifyEmail(): void {
		// this.verifyEmail$ = this.authService
		// 	.userProvider((user: AuthUser) => {
		// 		return this.authService.sendVerificationEmail(user!);
		// 	})
		// 	.subscribe();
	}

	logout(): void {
		this.signOut$ = this.sessionService.logout().subscribe();
	}

	ngOnDestroy(): void {
		this.verifyEmail$?.unsubscribe();
	}
}
