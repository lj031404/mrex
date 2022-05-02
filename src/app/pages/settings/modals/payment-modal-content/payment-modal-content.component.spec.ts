import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModalContentComponent } from './payment-modal-content.component';

describe('PaymentModalContentComponent', () => {
  let component: PaymentModalContentComponent;
  let fixture: ComponentFixture<PaymentModalContentComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PaymentModalContentComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PaymentModalContentComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
