import { NgModule } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';

import { SSConfirmPasswordComponent } from '@softside/ui-sdk/lib/components/composed/confirm-password';
import { SSEmailComponent } from '@softside/ui-sdk/lib/components/inputs/email';
import { SSPasswordComponent } from '@softside/ui-sdk/lib/components/inputs/password';
import { SSTextComponent } from '@softside/ui-sdk/lib/components/inputs/text';
import { SSTextareaComponent } from '@softside/ui-sdk/lib/elements';
import { SSSubmitButtonComponent } from '@softside/ui-sdk/lib/components/buttons/submit';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
	declarations: [
		ProfileViewComponent,
	],
	imports: [
		SharedModule,
		ProfileRoutingModule,
		ImageCropperModule,
		SSTextComponent,
		SSEmailComponent,
		SSTextareaComponent,
		SSPasswordComponent,
		SSConfirmPasswordComponent,
		SSSubmitButtonComponent,
	],
})
export class ProfileModule {}
