import { Component, DestroyRef, EventEmitter, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { code, personCircleOutline, idCardOutline, logOutOutline } from 'ionicons/icons';
import { NgStyle } from '@angular/common';
import { NgLetModule } from 'ng-let';
import {
	IonToolbar,
	IonButtons,
	IonMenuButton,
	IonTitle,
	IonIcon,
	IonSearchbar,
	IonButton,
	IonChip,
	IonAvatar,
	IonLabel,
	IonPopover,
	IonList,
	IonItem,
} from '@ionic/angular/standalone';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';
import { User } from 'projects/api';

import { SessionService } from '../../core/services/session.service';
import { ShellLoadingBarComponent } from '../_components/shell-loading-bar/shell-loading-bar.component';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	standalone: true,
	imports: [
		IonToolbar,
		ShellLoadingBarComponent,
		IonButtons,
		IonMenuButton,
		IonTitle,
		RouterLink,
		IonIcon,
		IonSearchbar,
		NgLetModule,
		IonButton,
		IonChip,
		IonAvatar,
		IonLabel,
		IonPopover,
		NgStyle,
		IonList,
		IonItem,
	],
})
export class HeaderComponent {
	sessionService = inject(SessionService);
	router = inject(Router);
	_appToast = inject(AppToastService);
	destroyRef = inject(DestroyRef);

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

	revealId(id: User['id']): void {
		this._appToast.createToast(id.toString(), 0);
	}

	logout(): void {
		this.sessionService.followup(this.sessionService.logout(), undefined, this.destroyRef);
	}

	getUserDisplay(user: User): string {
		if (!user) {
			return '';
		}

		return this.sessionService.getUserDisplay(user);
	}
}
