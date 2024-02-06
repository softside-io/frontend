import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonSplitPane, IonMenu, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';

import { IMenuItem, appPages } from '../side-navbar/side-navbar';
import { AppToastService } from '../../shared/services/app-toast.service';
import { SideNavbarComponent } from '../side-navbar/side-navbar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
	selector: 'app-shell',
	templateUrl: './shell.component.html',
	styleUrls: ['./shell.component.scss'],
	standalone: true,
	imports: [IonHeader, HeaderComponent, IonSplitPane, IonMenu, IonContent, SideNavbarComponent, IonRouterOutlet],
})
export class ShellComponent {
	appPages: Array<IMenuItem> = appPages;
	_appToast = inject(AppToastService);
	router = inject(Router);

	ngOnInit(): void {
		// TODO: handle undefined verified

		const verified = this.router.getCurrentNavigation()?.extras.state?.['verified'];

		if (verified) {
			this._appToast.createToast(`Your email has been successfully verified!`, 5000, {
				color: 'success',
				size: 'medium',
			});
		}
	}
}
