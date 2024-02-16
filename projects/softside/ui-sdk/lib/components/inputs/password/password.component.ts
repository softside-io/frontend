import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Helpers } from '@softside/ui-sdk/lib/_utils';
import { SSInputComponent } from '@softside/ui-sdk/lib/elements';

@Component({
	selector: 'ss-password',
	template: ` <ss-input
		[label]="label"
		placeholder="Enter your password"
		type="password"
		maxlength="50"
		minlength="6"
		[required]="true"
		[controlKey]="camelize(label)"
		[disabled]="disabled"
		[hideshow]="true"
		[directParentGroup]="directParentGroup"
	></ss-input>`,
	standalone: true,
	imports: [SSInputComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SSPasswordComponent {
	@Input() label: string = 'Password';
	@Input() disabled: boolean = false;
	@Input() directParentGroup: FormGroup | null = null;

	camelize(text: string): string {
		return Helpers.camelize(text);
	}
}
