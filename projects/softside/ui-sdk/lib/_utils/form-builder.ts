import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

import { Helpers } from './helpers';

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

	static fields<T extends PresetField | TextField | FormlySSFieldConfig>(presets: T): FormlySSFieldConfig {
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
			case 'text':
				const textConfig = { ...presets } as TextField;

				return {
					key: Helpers.camelize(textConfig.opts?.label),
					type: 'ssTextInput',
					props: {
						label: textConfig.opts?.label,
						placeholder: `Enter your ${textConfig.opts?.label}`,
						required: true,
						type: 'text',
						minLength: 1,
						maxLength: 100,
						counter: true,
					},
					validation: {
						messages: {
							required: `${textConfig.opts?.label} is required`,
						},
					},
				};
			default: {
				return presets;
			}
		}
	}

	static create<T = FormlySSFieldConfig>(formlyFieldConfig: T[]): FormlyFieldConfig[] {
		return formlyFieldConfig as FormlyFieldConfig[];
	}
}
export type PresetField = {
	field: 'email' | 'password';
};
export type TextField = {
	field: 'text';
	opts: {
		label: string;
	};
};

type FormlySSFieldConfig = FormlyFieldProps & Partial<ExtraProps>;

type ExtraProps = {
	key?: string | number | (string | number)[];
	counter: boolean;
	conceal: {
		showToggle: boolean;
		default: boolean;
	};
	props: FormlySSFieldConfig;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[additionalProperties: string]: any;
};

//
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
