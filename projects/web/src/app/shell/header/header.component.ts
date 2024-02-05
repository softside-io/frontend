import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { code, personCircleOutline, idCardOutline, logOutOutline } from 'ionicons/icons';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';

import { SessionService } from '../../core/services/session.service';
import { User } from '../../shared/models/user.model';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	sessionService = inject(SessionService);
	router = inject(Router);
	_appToast = inject(AppToastService);

	@Output() toggleDrawer = new EventEmitter();

	user = this.sessionService.currentUser;

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
		this.sessionService.logout().subscribe();
	}

	getUserDisplay(user: User): string {
		if (!user) {
			return '';
		}

		return this.sessionService.getUserDisplay(user);
	}
}
