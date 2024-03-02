import {
	NgModule,
	importProvidersFrom,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonCol,
	IonContent,
	IonIcon,
	IonRouterOutlet,
	IonRow,
	IonText,
} from '@ionic/angular/standalone';
import {
	GoogleLoginProvider,
	SocialAuthServiceConfig,
	SocialLoginModule,
} from '@abacritt/angularx-social-login';

import { SSEmailComponent } from '@softside/ui-sdk/lib/components/inputs/email';
import { SSPasswordComponent } from '@softside/ui-sdk/lib/components/inputs/password';
import { SSConfirmPasswordComponent } from '@softside/ui-sdk/lib/components/composed/confirm-password';
import { SSButtonComponent } from '@softside/ui-sdk/lib/elements';
import { environment } from 'projects/web/src/environments/environment';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ConfirmEmailComponent } from './verify-email/verify-email.component';
import { AuthShellComponent } from './auth-shell/auth-shell.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
	imports: [
		AuthRoutingModule,
		SSEmailComponent,
		SSPasswordComponent,
		SSConfirmPasswordComponent,
		SSButtonComponent,
		IonRouterOutlet,
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonRow,
		IonCol,
		IonIcon,
		IonButton,
		IonButtons,
		IonText,
		AuthShellComponent,
		LoginComponent,
		RegisterComponent,
		ForgetPasswordComponent,
		ResetPasswordComponent,
		ConfirmEmailComponent,
	],
	providers: [
		importProvidersFrom(
			SocialLoginModule,
		),
		{
			provide:
				'SocialAuthServiceConfig',
			useValue: {
				autoLogin:
					false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider:
							new GoogleLoginProvider(
								environment.googleClientId,
								{
									prompt_parent_id:
										'googleLoginWrapper',
								},
							),
					},
				],
				onError: (
					err,
				) => {
					console.error(
						err,
					);
				},
			} as SocialAuthServiceConfig,
		},
	],
})
export class AuthModule {}
