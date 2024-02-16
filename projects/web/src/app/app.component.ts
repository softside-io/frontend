import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';

import { BroadcastChannels, BroadcastEventEnum, BroadcastMessage, BroadcastService } from '@softside/ui-sdk/lib/shared';
import { LoginResponseType } from 'projects/api';

import { ThemeService } from './core/services/theme.service';
import { SessionService } from './core/services/session.service';
import { StorageAccessorService } from './shared/services/storage-accessor.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [IonApp, IonRouterOutlet],
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	broadcastService = inject(BroadcastService);
	storage = inject(StorageAccessorService);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	sessionService = inject(SessionService);

	constructor() {
		addIcons({
			informationCircleOutline,
		});

		this.broadcastService.createChannel(BroadcastChannels.AUTH_CHANNEL);

		this.broadcastService.getMessage(BroadcastChannels.AUTH_CHANNEL).subscribe({
			next: (message: BroadcastMessage) => {
				switch (message.action) {
					case BroadcastEventEnum.LOGOUT:
						this.storage.removeLocalStorageKey('session');
						this.router.navigate(['/auth']);
						break;
					case BroadcastEventEnum.LOGIN:
						this.sessionService.setSession(message.data?.session as LoginResponseType);
						const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
						this.router.navigateByUrl(returnUrl, { replaceUrl: true });
						break;
					case BroadcastEventEnum.SESSION:
						const session = message.data?.session as LoginResponseType;
						this.storage.setLocalStorage('session', session, true);
						this.sessionService.updateLoggedInUser(session.user);
						break;
					default:
						break;
				}
			},
			error: (error: Error) => {
				throw new Error(error.message);
			},
		});
	}

	theme = inject(ThemeService);
}
