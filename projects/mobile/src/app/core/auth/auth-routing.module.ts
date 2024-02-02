import { NgModule } from '@angular/core';
import {
	RouterModule,
	Routes,
} from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthShellComponent } from './auth-shell/auth-shell.component';
import { NotFoundComponent } from '../../pages/not-found/not-found.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: '',
		component:
			AuthShellComponent,
		children: [
			{
				path: 'login',
				component:
					LoginComponent,
				// anonymous guard
			},
			{
				path: 'register',
				component:
					RegisterComponent,
				// anonymous guard
			},
			{
				path: 'forget-password',
				component:
					ForgetPasswordComponent,
				// anonymous guard
			},
			{
				path: 'verify-email',
				component:
					VerifyEmailComponent,
				// verify guard
			},
			{
				path: '404',
				component:
					NotFoundComponent,
			},
		],
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(
			routes,
		),
	],
	exports: [RouterModule],
	providers: [],
})
export class AuthRoutingModule {}
