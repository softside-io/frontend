import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonRow,
	IonCol,
	IonButton,
	IonButtons,
	IonText,
} from '@ionic/angular/standalone';

import { AppToastService } from 'projects/web/src/app/shared/services/app-toast.service';
import { ConvertToForm, FB } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from '../../services/session.service';
import { AsyncRefDirective } from '../../../shared/directives/async-ref.directive';
import { SSConfirmPasswordComponent } from '../../../../../../softside/ui-sdk/lib/components/composed/confirm-password/confirm-password.component';
import { SSEmailComponent } from '../../../../../../softside/ui-sdk/lib/components/inputs/email/email.component';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonRow,
		IonCol,
		ReactiveFormsModule,
		SSEmailComponent,
		SSConfirmPasswordComponent,
		IonButton,
		AsyncRefDirective,
		IonButtons,
		IonText,
		RouterLink,
	],
})
export class RegisterComponent {
	protected sessionService = inject(SessionService);
	protected _appToast = inject(AppToastService);
	protected destroyRef = inject(DestroyRef);

	form: RegisterForm = FB.group({
		email: FB.string(''),
		confirmPasswordGroup: FB.group({
			password: FB.string(''),
			confirmPassword: FB.string(''),
		}),
	});

	register$: Subscription | null = null;

	submitRecord(): void {
		if (this.form.invalid) {
			return;
		}

		const {
			email,
			confirmPasswordGroup: { password },
		} = this.form.getRawValue();

		this.register$ = this.sessionService.followup(
			this.sessionService.registerNewAccount(email, password),
			undefined,
			this.destroyRef,
		);
	}
}

type Register = {
	email: string;
	confirmPasswordGroup: {
		password: string;
		confirmPassword: string;
	};
};
type RegisterForm = ConvertToForm<Register>;
