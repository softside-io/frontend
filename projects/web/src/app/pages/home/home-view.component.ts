import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonCard, IonCardHeader, IonText, IonCardContent } from '@ionic/angular/standalone';

import { SessionService } from 'projects/web/src/app/core/services/session.service';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
	selector: 'app-home-view',
	templateUrl: './home-view.component.html',
	styleUrls: ['./home-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [IonContent, PageHeaderComponent, IonCard, IonCardHeader, IonText, IonCardContent],
})
export class HomeViewComponent {
	router = inject(Router);
	authService = inject(SessionService);
}
