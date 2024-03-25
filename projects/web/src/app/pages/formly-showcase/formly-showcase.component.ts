import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonContent } from '@ionic/angular/standalone';

import { SSButtonComponent } from '@softside/ui-sdk/lib/elements';
import { FormBase } from '@softside/ui-sdk/lib/_utils';
import { SSFormComponent } from '@softside/ui-sdk/lib/components/composed/form';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { myForm } from './formly.config';

type FormlyShowcase = {
	email: string;
};

@Component({
	selector: 'app-formly-showcase',
	templateUrl: './formly-showcase.component.html',
	styleUrls: ['./formly-showcase.component.scss'],
	standalone: true,
	imports: [PageHeaderComponent, IonContent, IonCard, IonCardContent, SSButtonComponent, SSFormComponent],
})
export class FormlyShowcaseComponent extends FormBase<FormlyShowcase> implements OnInit {
	ngOnInit(): void {
		this.formInitialValue = {
			email: 'example@test.com',
		};

		this.formConfig = myForm;
	}

	override submit(): void {
		console.log(this.formValue);
	}
}
