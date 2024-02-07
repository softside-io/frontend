import { NgModule } from '@angular/core';
import {
	RouterModule,
	Routes,
} from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ConfirmEmailComponent } from './verify-email/verify-email.component';
import { AuthShellComponent } from './auth-shell/auth-shell.component';
import { NotFoundComponent } from '../../pages/not-found/not-found.component';
import {
	publicGuard,
	verifyGuard,
} from '../guards/auth.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';

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
				canActivate: [
					publicGuard,
				],
			},
			{
				path: 'register',
				component:
					RegisterComponent,
				canActivate: [
					publicGuard,
				],
			},
			{
				path: 'forget-password',
				component:
					ForgetPasswordComponent,
				canActivate: [
					publicGuard,
				],
			},
			{
				path: 'reset-password',
				component:
					ResetPasswordComponent,
				canActivate: [
					publicGuard,
				],
			},
			{
				path: 'confirm-email',
				component:
					ConfirmEmailComponent,
				canActivate: [
					verifyGuard,
				],
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
