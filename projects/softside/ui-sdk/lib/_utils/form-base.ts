import { FB } from './form-builder';
import { CustomFormlyFieldConfig } from './formly-form';

export class FormBase<T> {
	formInitialValue: Partial<T> | null = null;
	form = FB.group();
	formConfig: Array<CustomFormlyFieldConfig> = [];
	get formValue(): T {
		return this.form.getRawValue() as T;
	}

	submit(): void {
		// This function is used as a default submit function for the form.
	}
}
