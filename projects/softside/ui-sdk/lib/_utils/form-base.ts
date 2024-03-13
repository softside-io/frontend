import { WritableSignal, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FB } from './form-builder';

export class FormBase<T> {
	formInitialValue: T | null = null;
	form = FB.group();
	config: WritableSignal<FormlyFieldConfig[]> = signal([]);
	get formValue(): T {
		return this.form.getRawValue() as T;
	}

	submit(): void {
		// This function is used as a default submit function for the form.
	}
}
