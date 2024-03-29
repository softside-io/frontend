import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-verify-email',
	templateUrl: './verify-email.component.html',
	styleUrls: ['./verify-email.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnDestroy {
	private authService = inject(AuthService);
	private router = inject(Router);

	signOut$: Subscription | null = null;
	verifyEmail$: Subscription | null = null;

	user$ = this.authService.currentUserProfile$;

	verifyEmail(): void {
		// this.verifyEmail$ = this.authService
		// 	.userProvider((user: AuthUser) => {
		// 		return this.authService.sendVerificationEmail(user!);
		// 	})
		// 	.subscribe();
	}

	logout(): void {
		// this.signOut$ = this.authService.logout().subscribe(() => {
		// 	this.router.navigateByUrl('auth/login', { replaceUrl: true });
		// });
	}

	ngOnDestroy(): void {
		this.signOut$?.unsubscribe();
		this.verifyEmail$?.unsubscribe();
	}
}
