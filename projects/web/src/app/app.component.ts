import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { ApiModule } from 'projects/api';

import { ThemeService } from './core/services/theme.service';
import { ShellModule } from './shell/shell.module';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [ShellModule, IonApp, IonRouterOutlet, ApiModule],
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	theme = inject(ThemeService);
}
