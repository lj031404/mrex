import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderStepsComponent } from './header-steps.component';

describe('HeaderStepsComponent', () => {
  let component: HeaderStepsComponent;
  let fixture: ComponentFixture<HeaderStepsComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ HeaderStepsComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(HeaderStepsComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
