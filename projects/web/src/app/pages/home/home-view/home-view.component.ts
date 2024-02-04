import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from 'projects/web/src/app/core/services/session.service';

@Component({
	selector: 'app-home-view',
	templateUrl: './home-view.component.html',
	styleUrls: ['./home-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeViewComponent {
	router = inject(Router);
	authService = inject(SessionService);
}
