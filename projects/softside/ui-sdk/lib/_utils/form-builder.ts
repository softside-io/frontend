import { AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

import { CustomFormlyFieldConfig } from './formly-form';

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

	static field(preset?: Presets, field?: Readonly<FormlyFieldConfig>): CustomFormlyFieldConfig {
		return new CustomFormlyFieldConfig(preset, field as FormlySSFieldConfig);
	}
}
export type FormlySSFieldConfig = FormlyFieldProps & Partial<ExtraProps>;

type Presets = 'email' | 'password' | 'text' | 'textArea' | 'confirmPassword';

type ExtraProps = {
	key: string;
	counter: boolean;
	defaultValue: number | string | boolean;
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
