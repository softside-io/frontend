import { FB, PresetField } from '@softside/ui-sdk/lib/_utils';

const formlyConfig = FB.create([
	FB.fields<PresetField>({ field: 'email' }),
	FB.fields<PresetField>({ field: 'password' }),
	// FB.fields<TextFields>({ field: 'text', opts: { label: 'custom text' } }),
	// FB.fields<PresetGroup>({ field: 'confirmPassword' }),
	// FB.fields<TextFields>({ field: 'textArea', opts: { label: 'Address' } }),
]);

export default formlyConfig;
