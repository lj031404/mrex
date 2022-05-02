import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyFinancialInfoComponent } from './property-financial-info.component';

describe('PropertyFinancialInfoComponent', () => {
  let component: PropertyFinancialInfoComponent;
  let fixture: ComponentFixture<PropertyFinancialInfoComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyFinancialInfoComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyFinancialInfoComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
