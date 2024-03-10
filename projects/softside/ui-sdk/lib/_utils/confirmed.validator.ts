import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const passwordControl = formGroup.get(controlName);
		const confirmPasswordControl = formGroup.get(matchingControlName);

		if (!passwordControl || !confirmPasswordControl) {
			return null;
		}

		if (passwordControl.value !== confirmPasswordControl.value) {
			confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, passwordMismatch: true });

			return { passwordMismatch: true };
		} else if (!confirmPasswordControl.value) {
			confirmPasswordControl.setErrors({ required: true });

			return { required: true };
		} else {
			const error = { ...confirmPasswordControl.errors };
			delete error['passwordMismatch'];
			const errors = Object.keys(error).length === 0 ? null : error;
			confirmPasswordControl.setErrors(errors);

			return errors;
		}
	};
}
export function fieldMatchValidator(
	control: AbstractControl,
	_field: FormlyFieldConfig,
	options?: {
		[id: string]: string;
	},
): ValidationErrors | null {
	if (!(options && options['keys']) || options['keys'].length != 2) {
		return null;
	}

	const control1 = control.value[options['keys'][0]];
	const control2 = control.value[options['keys'][1]];

	if (!control1 || !control2) {
		return null;
	}

	if (control1 === control2) {
		return null;
	}

	return {
		fieldMatch: {
			message: options['message'] || 'Fields should match',
		},
	};
}
