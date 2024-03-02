import { Routes } from '@angular/router';

import { ShellComponent } from './shell/shell/shell.component';
import { AuthModule } from './core/auth/auth.module';
import { authenticationGuard } from './core/guards/auth.guard';
import { ProfileViewComponent } from './pages/profile/profile-view.component';
import { HomeViewComponent } from './pages/home/home-view.component';
import { ContactsViewComponent } from './pages/contacts/contacts-view/contacts-view.component';
import { FormlyShowcaseComponent } from './pages/formly-showcase/formly-showcase.component';

export const routes: Routes = [
	{
		pathMatch: 'full',
		path: '',
		redirectTo: 'home',
	},
	{
		path: '',
		loadComponent: () => ShellComponent,
		canActivate: [authenticationGuard],
		children: [
			{
				path: 'home',
				loadComponent: () => HomeViewComponent,
			},
			{
				path: 'profile',
				loadComponent: () => ProfileViewComponent,
			},
			{
				path: 'contacts',
				loadComponent: () => ContactsViewComponent,
			},
			{
				path: 'formly-showcase',
				loadComponent: () => FormlyShowcaseComponent,
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
