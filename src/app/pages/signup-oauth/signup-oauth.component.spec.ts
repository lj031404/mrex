import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupOauthComponent } from './signup-oauth.component';

describe('SignupComponent', () => {
  let component: SignupOauthComponent;
  let fixture: ComponentFixture<SignupOauthComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ SignupOauthComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(SignupOauthComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
