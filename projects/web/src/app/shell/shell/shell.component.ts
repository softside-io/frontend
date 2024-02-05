import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { IMenuItem, appPages } from '../side-navbar/side-navbar';
import { AppToastService } from '../../shared/services/app-toast.service';

@Component({
	selector: 'app-shell',
	templateUrl: './shell.component.html',
	styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
	appPages: Array<IMenuItem> = appPages;
	_appToast = inject(AppToastService);
	router = inject(Router);

	ngOnInit(): void {
		const verified = this.router.getCurrentNavigation()?.extras.state?.['verified'];

		if (verified) {
			this._appToast.createToast(`Your email has been successfully verified!`, 5000, {
				color: 'success',
				size: 'medium',
			});
		}
	}
}
