import { Component } from '@angular/core';
import { ColumnMode, NgxDatatableModule } from 'ngx-softside-table';
import { IonContent, IonCard, IonCardContent, IonRow, IonCol, IonLabel } from '@ionic/angular/standalone';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
	selector: 'app-contacts-view',
	templateUrl: './contacts-view.component.html',
	styleUrls: ['./contacts-view.component.scss'],
	standalone: true,
	imports: [IonContent, PageHeaderComponent, IonCard, IonCardContent, IonRow, IonCol, IonLabel, NgxDatatableModule],
})
export class ContactsViewComponent {
	rows = [
		{
			name: 'Ethel Price',
			gender: 'female',
			company: 'Johnson, Johnson and Partners, LLC CMP DDC',
			age: 22,
		},
		{
			name: 'Claudine Neal',
			gender: 'female',
			company: 'Sealoud',
			age: 55,
		},
	];

	loadingIndicator = true;
	reorderable = true;

	columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company', sortable: false }];

	ColumnMode = ColumnMode;

	constructor() {
		setTimeout(() => {
			this.loadingIndicator = false;
		}, 1500);
	}
}
