import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailComponent } from './verify-email.component';

describe('VerifyEmailComponent', () => {
	let component: ConfirmEmailComponent;
	let fixture: ComponentFixture<ConfirmEmailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
    imports: [ConfirmEmailComponent],
}).compileComponents();

		fixture = TestBed.createComponent(ConfirmEmailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
