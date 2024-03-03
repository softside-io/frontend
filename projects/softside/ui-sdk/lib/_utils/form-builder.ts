import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export class FB {
	// to be fixed (remove parameters)
	static group<T extends { [K in keyof T]: AbstractControl<T[K]['value'], T[K]['value']> }>(
		controls: T = {} as T,
	): FormGroup<T> {
		return new FormGroup<T>(controls);
	}

	// to be removed
	static string(defaultValue: string = ''): FormControl<string> {
		return new FormControl(defaultValue, { nonNullable: true });
	}

	// to be removed
	static number(defaultValue: number = 0): FormControl<number> {
		return new FormControl(defaultValue, { nonNullable: true });
	}

	// to be removed
	static boolean(defaultValue: boolean = false): FormControl<boolean> {
		return new FormControl(defaultValue, { nonNullable: true });
	}

	static fieldPresets(presets: FieldConfig): FormlyFieldConfig {
		switch (presets.field) {
			case 'email':
				return {
					key: 'email',
					type: 'ssTextInput',
					props: {
						label: 'Email address',
						placeholder: 'Enter your email address',
						required: true,
						type: 'email',
						minLength: 1,
						maxLength: 50,
						counter: true,
					},
					validation: {
						messages: {
							required: 'First Name is required',
							email: 'Email must follow a valid format',
						},
					},
					validators: {
						validation: [Validators.email],
					},
				};
			case 'password':
				return {
					key: 'password',
					type: 'ssTextInput',
					props: {
						label: 'Password',
						placeholder: 'Enter your password',
						required: true,
						conceal: {
							showToggle: true,
							default: true,
						},
						type: 'password',
						minLength: 6,
						maxLength: 50,
						counter: true,
					},
					validation: {
						messages: {
							required: 'Password is required',
							minlength: 'Password must be at least 6 characters long',
						},
					},
				};
			default: {
				if (presets.opts?.label) {
					return {
						key: presets.opts?.label,
						type: 'ssTextInput',
						props: {
							label: presets.opts?.label,
							placeholder: `Enter your ${presets.opts?.label}`,
							required: true,
							type: 'text',
							minLength: 1,
							maxLength: 100,
							counter: true,
						},
						validation: {
							messages: {
								required: `${presets.opts?.label} is required`,
							},
						},
					};
				} else {
					return {};
				}
			}
		}
	}
}

type BaseField = {
	field: 'email' | 'password';
};

type CustomField = {
	field: 'text';
	opts: {
		label: string;
	};
};

type FieldConfig = BaseField | CustomField;

// to be removed
export type ConvertToForm<T> = T extends object
	? FormGroup<{
			[K in keyof T]: ConvertToForm<T[K]>;
		}>
	: T extends string
		? FormControl<string>
		: T extends number
			? FormControl<number>
			: T extends boolean
				? FormControl<boolean>
				: never;
// Example usage type ProfileForm = ConvertToForm<JSONResponseType>;
