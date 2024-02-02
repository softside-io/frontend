import { Routes } from '@angular/router';

import { HomeModule } from './pages/home/home.module';
import { ProfileModule } from './pages/profile/profile.module';
import { ShellComponent } from './shell/shell/shell.component';
import { AuthModule } from './core/auth/auth.module';
import { ContactsModule } from './pages/contacts/contacts.module';

export const routes: Routes = [
	{
		pathMatch: 'full',
		path: '',
		redirectTo: 'home',
	},
	{
		path: '',
		component: ShellComponent,
		// auth guard
		children: [
			{
				path: 'home',
				loadChildren: () => HomeModule,
			},
			{
				path: 'profile',
				loadChildren: () => ProfileModule,
			},
			{
				path: 'contacts',
				loadChildren: () => ContactsModule,
			},
		],
	},
	{
		path: 'auth',
		loadChildren: () => AuthModule,
	},
	{
		path: '**',
		redirectTo: 'auth/404',
	},
];
