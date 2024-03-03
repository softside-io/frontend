import { FormlyModule } from '@ngx-formly/core';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyIonicModule } from '@ngx-formly/ionic';

@NgModule({
	declarations: [],
	imports: [
		ReactiveFormsModule,
		FormlyIonicModule,
		FormlyModule,
	],
	exports: [
		ReactiveFormsModule,
		FormlyIonicModule,
		FormlyModule,
	],
})
export class SSFormlyDepsModule {}
