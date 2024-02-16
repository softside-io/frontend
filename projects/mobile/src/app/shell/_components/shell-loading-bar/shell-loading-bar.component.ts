import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonProgressBar } from '@ionic/angular/standalone';
import { AsyncPipe, NgIf } from '@angular/common';

import { AppSettingsService } from '../../../shared/services/app-settings.service';

@Component({
	selector: 'app-shell-loading-bar',
	templateUrl: './shell-loading-bar.component.html',
	styleUrls: ['./shell-loading-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgIf, IonProgressBar, AsyncPipe],
	standalone: true,
})
export class ShellLoadingBarComponent {
	public isLoading$ = inject(AppSettingsService).isAppLoading$;
}
