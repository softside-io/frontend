import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

import { SSFormlyConfigModule } from '@softside/ui-sdk/lib/modules/formly/config';

// Import providers here
export const modules = [
	IonicStorageModule.forRoot({
		driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage],
		name: 'SoftsideDB',
		storeName: 'Session',
	}),
	SSFormlyConfigModule,
];
