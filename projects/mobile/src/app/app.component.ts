import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';

import { ThemeService } from './core/services/theme.service';
import { SessionService } from './core/services/session.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [IonApp, IonRouterOutlet],
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	sessionService = inject(SessionService);

	constructor() {
		addIcons({
			informationCircleOutline,
		});
	}

	theme = inject(ThemeService);
}
