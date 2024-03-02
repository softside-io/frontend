import { FormlyFieldConfig } from '@ngx-formly/core';

const formlyConfig: FormlyFieldConfig[] = [
	{
		key: 'textInput',
		type: 'input',
		props: {
			label: 'Text Input',
			placeholder: 'Enter text',
			required: true,
		},
		validation: {
			messages: {
				required: 'Text Input is required',
			},
		},
	},
	{
		key: 'emailInput',
		type: 'input',
		props: {
			type: 'email',
			label: 'Email Input',
			placeholder: 'Enter email',
		},
	},
	{
		key: 'passwordInput',
		type: 'input',
		props: {
			type: 'password',
			label: 'Password Input',
			placeholder: 'Enter password',
		},
	},
	{
		key: 'numberInput',
		type: 'input',
		props: {
			type: 'number',
			label: 'Number Input',
			placeholder: 'Enter number',
		},
	},
	{
		key: 'checkboxInput',
		type: 'checkbox',
		props: {
			label: 'Checkbox Input',
		},
	},
	{
		key: 'radioInput',
		type: 'radio',
		props: {
			label: 'Radio Input',
			options: [
				{ value: 1, label: 'Option 1' },
				{ value: 2, label: 'Option 2' },
			],
		},
	},
	{
		key: 'selectInput',
		type: 'select',
		props: {
			label: 'Select Input',
			options: [
				{ label: 'Option 1', value: '1' },
				{ label: 'Option 2', value: '2' },
				{ label: 'Option 3', value: '3' },
			],
		},
	},
	{
		key: 'textareaInput',
		type: 'textarea',
		props: {
			label: 'Textarea Input',
			placeholder: 'Enter text',
		},
	},
	{
		key: 'dateInput',
		type: 'input',
		props: {
			type: 'date',
			label: 'Date Input',
			placeholder: 'Select date',
		},
	},
	{
		key: 'rangeInput',
		type: 'input',
		props: {
			type: 'range',
			label: 'Range Input',
			min: 0,
			max: 100,
		},
	},
];

export default formlyConfig;
