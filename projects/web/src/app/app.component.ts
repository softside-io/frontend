import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';

import { ThemeService } from './core/services/theme.service';
import { ShellModule } from './shell/shell.module';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [ShellModule, IonApp, IonRouterOutlet],
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	constructor() {
		addIcons({
			informationCircleOutline,
		});
	}

	theme = inject(ThemeService);
}
