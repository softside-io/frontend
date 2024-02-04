import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { code, personCircleOutline, idCardOutline, logOutOutline } from 'ionicons/icons';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';

import { SessionService } from '../../core/services/session.service';
import { User } from '../../shared/models/IUser.model';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	authService = inject(SessionService);
	router = inject(Router);
	_appToast = inject(AppToastService);

	@Output() toggleDrawer = new EventEmitter();

	user$ = this.authService.currentUserProfile$;

	constructor() {
		addIcons({
			code,
			personCircleOutline,
			idCardOutline,
			logOutOutline,
		});
	}

	revealId(id: string): void {
		this._appToast.createToast(id, 0);
	}

	logout(): void {
		// this.authService.logout().subscribe(() => {
		// 	this.router.navigateByUrl('auth/login', { replaceUrl: true });
		// });
	}

	getUserDisplay(user: User): string {
		if (!user) {
			return '';
		}

		return this.authService.getUserDisplay(user);
	}
}
