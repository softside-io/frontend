import { FB, PresetField, PresetGroup, TextField } from '@softside/ui-sdk/lib/_utils';

const formlyConfig = FB.create([
	FB.fields<PresetField>({ field: 'email' }),
	FB.fields<PresetField>({ field: 'password' }),
	FB.fields<TextField>({ field: 'text', opts: { label: 'custom text' } }),
	FB.fields<PresetGroup>({ field: 'confirmPassword' }),
]);

export default formlyConfig;
