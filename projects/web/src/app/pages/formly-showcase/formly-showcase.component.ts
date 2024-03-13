import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonContent } from '@ionic/angular/standalone';

import { SSButtonComponent } from '@softside/ui-sdk/lib/elements';
import { SSFormlyDepsModule } from '@softside/ui-sdk/lib/modules/formly/deps';
import { FormBase } from '@softside/ui-sdk/lib/_utils';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import formlyConfig from './formly.config';

type FormlyShowcase = {
	email: string;
	password: string;
};

@Component({
	selector: 'app-formly-showcase',
	templateUrl: './formly-showcase.component.html',
	styleUrls: ['./formly-showcase.component.scss'],
	standalone: true,
	imports: [PageHeaderComponent, IonContent, IonCard, IonCardContent, SSButtonComponent, SSFormlyDepsModule],
})
export class FormlyShowcaseComponent extends FormBase<FormlyShowcase> implements OnInit {
	ngOnInit(): void {
		this.formInitialValue = {
			email: 'example@test.com',
			password: 'test123',
		};

		this.config.set(formlyConfig);
	}

	override submit(): void {
		console.log(this.formValue?.email);
	}
}
