import { FormlyModule } from '@ngx-formly/core';
import { NgModule } from '@angular/core';

import { SSInputFormlyComponent } from '@softside/ui-sdk/lib/elements';
import { fieldMatchValidator } from '@softside/ui-sdk/lib/_utils';

@NgModule({
	declarations: [],
	imports: [
		FormlyModule.forRoot({
			validators: [
				{
					name: 'fieldMatch',
					validation:
						fieldMatchValidator,
				},
			],
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
