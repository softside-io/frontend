import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonContent } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { FormlyModule } from '@ngx-formly/core';

import { FB } from '@softside/ui-sdk/lib/_utils';
import { SSButtonComponent } from '@softside/ui-sdk/lib/elements';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import formlyConfig from './formly.config';

@Component({
	selector: 'app-formly-showcase',
	templateUrl: './formly-showcase.component.html',
	styleUrls: ['./formly-showcase.component.scss'],
	standalone: true,
	imports: [
		PageHeaderComponent,
		IonContent,
		IonCard,
		IonCardContent,
		SSButtonComponent,
		ReactiveFormsModule, // required
		FormlyIonicModule, // required
		FormlyModule, // requird. Find a way to use forChild without injecting Formly globally
	],
})
export class FormlyShowcaseComponent {
	form = FB.group();
	config = formlyConfig;
	submit(): void {
		console.log(this.form.getRawValue());
	}
}
