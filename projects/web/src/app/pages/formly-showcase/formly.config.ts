import { FB } from '@softside/ui-sdk/lib/_utils';

export const myForm = [FB.field('email'), FB.fieldGroup('confirmPassword'), FB.field('number')];
// Might use the below syntax for groups
// FB.group('confirmPasswordGroup', [FB.field('password'), FB.field('confirmPassword')]).validators(passwordValidator)
export type FormlyShowcase = {
	email: string;
	confirmPasswordGroup: {
		password: string;
		confirmPassword: string;
	};
	checkbox: boolean;
};
