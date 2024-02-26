import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

// Import providers here
export const modules = [
	IonicStorageModule.forRoot({
		driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage],
		name: 'SoftsideDB',
		storeName: 'Session',
	}),
	SocialLoginModule,
];
