import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@app/core/core.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ RegisterComponent ],
		imports: [
		RouterTestingModule,
		NgbModule,

		TranslateModule.forRoot(),
		ReactiveFormsModule,
		SharedModule,
		CoreModule
		]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(RegisterComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
