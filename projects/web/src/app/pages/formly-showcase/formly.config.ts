import { FormlyFieldConfig } from '@ngx-formly/core';

import { FB } from '@softside/ui-sdk/lib/_utils';

const formlyConfig: FormlyFieldConfig[] = [
	FB.fieldPresets({ field: 'email' }),
	FB.fieldPresets({ field: 'password' }),
	FB.fieldPresets({ field: 'text', opts: { label: 'custom text' } }),
];

export default formlyConfig;
