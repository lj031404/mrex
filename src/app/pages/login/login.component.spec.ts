import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '@app/core/core.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '@app/shared/shared.module';
import { MockAuthenticationService } from '@app/core/authentication/authentication.service.mock';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		imports: [
		NgbModule,
		RouterTestingModule,
		TranslateModule.forRoot(),
		MockAuthenticationService,
		ReactiveFormsModule,
		SharedModule,
		CoreModule
		],
		declarations: [LoginComponent]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(LoginComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
