import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotStep1Component } from './forgot-step1.component';

describe('ForgotStep1Component', () => {
  let component: ForgotStep1Component;
  let fixture: ComponentFixture<ForgotStep1Component>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ ForgotStep1Component ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(ForgotStep1Component);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
