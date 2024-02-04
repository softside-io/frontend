import { Component, inject } from '@angular/core';

import { StorageAccessorService } from 'projects/web/src/app/shared/services/storage-accessor.service';

import { SessionService } from '../../core/services/session.service';
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
	authService = inject(SessionService);
	storage = inject(StorageAccessorService);

	user$ = this.authService.currentUserProfile$;

	// 	ngOnInit(): void {
	// 		this.user$.pipe(take(1)).subscribe((user: User | null) => {
	// 			if (this.storage.checkExistance(user!.uid)) {
	// 				this.storage.removeLocalStorageKey(user!.uid);

	// 				this._appToast.createToast(`Welcome ${this.authService.getUserDisplay(user!)}`, 3000, {
	// 					color: 'secondary',
	// 					size: 'medium',
	// 				});
	// 			}
	// 		});
	// 	}
}
