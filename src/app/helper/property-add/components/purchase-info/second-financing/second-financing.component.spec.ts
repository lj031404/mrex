import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondFinancingComponent } from './second-financing.component';

describe('SecondFinancingComponent', () => {
  let component: SecondFinancingComponent;
  let fixture: ComponentFixture<SecondFinancingComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ SecondFinancingComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(SecondFinancingComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
