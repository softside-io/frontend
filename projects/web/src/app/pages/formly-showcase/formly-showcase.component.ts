import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonContent } from '@ionic/angular/standalone';

import { SSButtonComponent } from '@softside/ui-sdk/lib/elements';
import { SSFormlyDepsModule } from '@softside/ui-sdk/lib/modules/formly/deps';
import { FB } from '@softside/ui-sdk/lib/_utils';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import formlyConfig from './formly.config';

@Component({
	selector: 'app-formly-showcase',
	templateUrl: './formly-showcase.component.html',
	styleUrls: ['./formly-showcase.component.scss'],
	standalone: true,
	imports: [PageHeaderComponent, IonContent, IonCard, IonCardContent, SSButtonComponent, SSFormlyDepsModule],
})
export class FormlyShowcaseComponent {
	form = FB.group();
	config = formlyConfig;
	submit(): void {
		console.log(this.form.getRawValue());
	}
}
