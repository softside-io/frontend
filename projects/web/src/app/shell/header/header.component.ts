import { Component, DestroyRef, EventEmitter, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { code, personCircleOutline, idCardOutline, logOutOutline } from 'ionicons/icons';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
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
	IonText,
} from '@ionic/angular/standalone';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';
import { User } from 'projects/api';
import { Helpers } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from '../../core/services/session.service';
import { ShellLoadingBarComponent } from '../_components/shell-loading-bar/shell-loading-bar.component';
import { ThemeService } from '../../core/services/theme.service';

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
		AsyncPipe,
		IonText,
		NgIf,
	],
})
export class HeaderComponent {
	sessionService = inject(SessionService);
	router = inject(Router);
	_appToast = inject(AppToastService);
	destroyRef = inject(DestroyRef);
	theme = inject(ThemeService);

	@Output() toggleDrawer = new EventEmitter();

	user$ = this.sessionService.loggedInUser$;

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
		Helpers.takeOne(this.sessionService.logout(), undefined, this.destroyRef);
	}
}
