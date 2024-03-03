import { FormlyModule } from '@ngx-formly/core';
import { NgModule } from '@angular/core';

import { SSInputFormlyComponent } from '@softside/ui-sdk/lib/elements';

@NgModule({
	declarations: [],
	imports: [
		FormlyModule.forRoot({
			types: [
				{
					name: 'ssTextInput',
					component:
						SSInputFormlyComponent,
				},
			],
			// Add any other global configurations here
		}),
	],
	exports: [FormlyModule],
})
export class SSFormlyConfigModule {}
