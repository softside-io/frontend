import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { IonItem, IonIcon, IonTextarea } from '@ionic/angular/standalone';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { NgLetModule } from 'ng-let';
import { Observable } from 'rxjs/internal/Observable';

import { SSFormlyDepsModule } from '@softside/ui-sdk/lib/modules/formly/deps';

@Component({
	selector: 'ss-formly-input',
	template: `
		<ion-item lines="none">
			<ion-textarea
				*ngLet="this.fVM.errorMessage$ | async as error"
				[formControl]="control"
				[ionFormlyAttributes]="field"
				[label]="label"
				[placeholder]="props.placeholder"
				[maxlength]="this.props.maxLength || null"
				[autoGrow]="true"
				labelPlacement="floating"
				fill="solid"
				[errorText]="error"
			></ion-textarea>
			<formly-validation-message
				class="hidden"
				#validation
				[field]="field"
			></formly-validation-message>
		</ion-item>
	`,
	imports: [NgIf, IonItem, IonIcon, IonTextarea, SSFormlyDepsModule, NgLetModule, AsyncPipe],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SSTextAreaFormlyComponent extends FieldType {
	@ViewChild('validation', { static: true }) fVM!: { errorMessage$: Observable<string> };

	constructor() {
		super();
	}

	get label(): string {
		let label = this.props.label || this.props.placeholder || '';
		label = label.length > 0 ? label : '&nbsp;'; // Prevent label from collapsing

		if (this.props.required) {
			label += ' *';
		}

		return label;
	}

	get control(): FormControl {
		return this.formControl as FormControl;
	}
}
