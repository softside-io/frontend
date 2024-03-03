import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, signal } from '@angular/core';
import { IonInput, IonItem, IonIcon, IonNote } from '@ionic/angular/standalone';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { FormControl } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { FieldType } from '@ngx-formly/core';
import { TextFieldTypes } from '@ionic/core';
import { NgLetModule } from 'ng-let';
import { Observable } from 'rxjs/internal/Observable';

import { SSFormlyDepsModule } from '@softside/ui-sdk/lib/modules/formly/deps';

@Component({
	selector: 'ss-formly-input',
	template: `
		<ion-item lines="none">
			<ion-input
				*ngLet="this.fVM.errorMessage$ | async as error"
				[type]="type"
				[formControl]="control"
				[ionFormlyAttributes]="field"
				[label]="label"
				labelPlacement="floating"
				[counter]="props['counter']"
				fill="solid"
				[clearInput]="clearInput"
				[clearOnEdit]="clearOnEdit"
				[errorText]="error"
			></ion-input>
			<formly-validation-message
				class="hidden"
				#validation
				[field]="field"
			></formly-validation-message>
			<div
				*ngIf="conceal && conceal.showToggle"
				[ngClass]="{
					'!right-[2rem]': control.value,
					'!bottom-[1.4rem]': props['counter']
				}"
				class="w-[29px] h-[29px] transition-all ease-in-out duration-[50ms] z-10 cursor-pointer absolute right-0 bottom-0 text-center"
				(click)="toggleShow()"
				(keydown)="onKeyDown($event)"
			>
				<ion-icon
					tabindex="0"
					class="text-lg"
					[style.color]="'var(--ion-color-step-600, #666)'"
					size="medium"
					[name]="concealEnabled() ? 'eye-off-outline' : 'eye-outline'"
				></ion-icon>
			</div>
		</ion-item>
	`,
	imports: [NgIf, IonItem, IonIcon, IonInput, IonNote, SSFormlyDepsModule, NgClass, NgLetModule, AsyncPipe],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SSInputFormlyComponent extends FieldType implements OnInit {
	@Input() clearInput: boolean = true;
	@Input() clearOnEdit: boolean = false;
	concealEnabled = signal(false);
	@ViewChild(IonInput) input!: IonInput;
	@ViewChild('validation', { static: true }) fVM!: { errorMessage$: Observable<string> };

	constructor() {
		super();
		addIcons({
			eyeOutline,
			eyeOffOutline,
		});
	}

	ngOnInit(): void {
		this.concealEnabled.set(this.props['conceal']?.default ?? false);

		if (this.concealEnabled() && this.props.type == 'password') {
			this.props.type = 'text';
		}
	}

	get label(): string {
		let label = this.props.label || this.props.placeholder || '';
		label = label.length > 0 ? label : '&nbsp;'; // Prevent label from collapsing

		if (this.props.required) {
			label += ' *';
		}

		return label;
	}

	get conceal(): { showToggle: boolean; default: boolean } | undefined {
		return this.props?.['conceal'];
	}

	get control(): FormControl {
		return this.formControl as FormControl;
	}

	get type(): string {
		return this.conceal && this.conceal.default ? 'password' : this.props.type || 'text'; // Default type is 'text'
	}

	onKeyDown(event: KeyboardEvent): void {
		if (event.code == 'Space') {
			this.toggleShow();
		}
	}

	toggleShow(): void {
		this.concealEnabled.set(!this.concealEnabled());
		this.input.type = this.concealEnabled() ? 'password' : (this.props.type as TextFieldTypes);
	}
}
