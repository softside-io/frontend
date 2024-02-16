import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
	IonLabel,
	IonContent,
	IonIcon,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { help, home } from 'ionicons/icons';

@Component({
	selector: 'app-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss'],
	standalone: true,
	imports: [
		IonContent,
		IonLabel,
		IonIcon,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonButton,
		RouterLink,
	],
})
export class NotFoundComponent {
	router = inject(Router);

	constructor() {
		addIcons({
			help,
			home,
		});
	}
}
