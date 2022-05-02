import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotStep3Component } from './forgot-step3.component';

describe('ForgotStep3Component', () => {
  let component: ForgotStep3Component;
  let fixture: ComponentFixture<ForgotStep3Component>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ ForgotStep3Component ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(ForgotStep3Component);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
