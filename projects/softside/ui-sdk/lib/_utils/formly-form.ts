import { Validators } from '@angular/forms';

import { FB, FormlySSFieldConfig } from './form-builder';
import { Helpers } from './helpers';

export class CustomFormlyFieldConfig {
	private _field: FormlySSFieldConfig;

	constructor(preset?: 'text' | 'email' | 'password' | 'textArea' | 'confirmPassword', field?: FormlySSFieldConfig) {
		if (field) {
			this._field = field;

			return;
		}

		switch (preset) {
			case 'email':
				this._field = {
					key: 'email',
					type: 'ssTextInput',
					defaultValue: '',
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

				break;
			case 'password':
				this._field = {
					key: Helpers.camelize('Password'),
					type: 'ssTextInput',
					defaultValue: '',
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

				break;
			case 'text':
				this._field = {
					key: 'text',
					type: 'ssTextInput',
					defaultValue: '',
					props: {
						label: 'Text',
						placeholder: 'Enter your text',
						type: 'text',
						minLength: 1,
						maxLength: 100,
						counter: true,
					},
				};

				break;
			case 'textArea':
				this._field = {
					key: 'textArea',
					type: 'ssTextAreaInput',
					defaultValue: '',
					props: {
						label: 'Text Area',
						placeholder: 'Enter your text',
						required: false,
						maxLength: 300,
					},
				};

				break;
			case 'confirmPassword':
				const password = 'Password';
				const confirmPassword = 'Confirm Password';

				this._field = {
					validators: {
						validation: [
							{
								name: 'fieldMatch',
								options: {
									errorPath: Helpers.camelize(confirmPassword),
									keys: [Helpers.camelize(password), Helpers.camelize(confirmPassword)],
									message: `${password}s should match`,
								},
							},
						],
					},
					key: 'confirmPasswordGroup',
					fieldGroup: [
						FB.field('password').key(Helpers.camelize(password)).label(password).build(),
						FB.field('password').key(Helpers.camelize(confirmPassword)).label(confirmPassword).build(),
					],
				};

				break;
			default: {
				this._field = {};

				break;
			}
		}
	}

	label(label: string): CustomFormlyFieldConfig {
		this._field.props && (this._field.props.label = label);

		return this;
	}

	get type(): string {
		// Test with checkbox field (type should be boolean)
		return typeof this._field.props?.type;
	}

	key(key: string): CustomFormlyFieldConfig {
		this._field.key = key;

		return this;
	}

	build(): Readonly<FormlySSFieldConfig> {
		return this.customClone(this._field as Readonly<FormlySSFieldConfig>);
	}

	// This is needed to prevent changes from the consumer level on the form configuration manually
	// It is only allowed this way to be manipulated using this class's utility functions
	private customClone<T extends object>(obj: T): T {
		// Create a clone skeleton that directly mirrors the structure of obj
		const cloneSkeleton = Array.isArray(obj) ? [] : typeof obj === 'object' ? {} : obj;
		const clone: Partial<T> = cloneSkeleton;

		(Object.keys(obj) as Array<keyof T>).forEach((key) => {
			const value = obj[key] as T[keyof T];

			if (typeof value === 'function') {
				// Copy functions by reference
				clone[key] = value;
			} else if (value && typeof value === 'object' && !Array.isArray(value)) {
				try {
					// Attempt structuredClone for non-function objects
					clone[key] = structuredClone(value);
				} catch (e) {
					// If structuredClone fails, fallback to customClone
					// Ensure that customClone is called only on types that extend object
					clone[key] = this.customClone(value); // Using `as any` to bypass the constraint check
				}
			} else if (Array.isArray(value)) {
				// Handle arrays separately to ensure they are cloned correctly
				clone[key] = value.map<T[keyof T]>((item) => {
					return this.customClone(item);
				}) as T[keyof T];
			} else {
				// For non-object and non-function values, copy by reference
				clone[key] = value;
			}
		});

		return clone as T;
	}
}
