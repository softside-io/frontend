import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, TitleCasePipe } from '@angular/common';

import { IBreadcrumbItem } from '../../../models/IBreadcrumbItem';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss'],
	standalone: true,
	imports: [NgIf, NgFor, RouterLink, TitleCasePipe],
})
export class BreadcrumbComponent {
	@Input() items: IBreadcrumbItem[] = [];
}
