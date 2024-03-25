import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { CustomFormlyFieldConfig } from '@softside/ui-sdk/lib/_utils';
import { SSFormlyDepsModule } from '@softside/ui-sdk/lib/modules/formly/deps';

@Component({
	selector: 'ss-form',
	template: `
		<form
			[formGroup]="form()"
			(ngSubmit)="submitEvent.emit()"
		>
			<formly-form
				[model]="formInitialValue()"
				[fields]="formConfig()"
				[form]="form()"
			></formly-form>
			<ng-content></ng-content>
		</form>
	`,
	standalone: true,
	imports: [SSFormlyDepsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SSFormComponent<T> {
	form = input.required<FormGroup>();
	formInitialValue = input<T>();
	formConfig = input.required<Array<Readonly<FormlyFieldConfig>>, CustomFormlyFieldConfig[]>({
		transform: (value: CustomFormlyFieldConfig[]) => {
			return value.map((field) => {
				return field.build() as Readonly<FormlyFieldConfig>;
			});
		},
	});

	@Output() submitEvent = new EventEmitter();
}
