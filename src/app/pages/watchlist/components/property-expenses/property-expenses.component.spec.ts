import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyExpensesComponent } from './property-expenses.component';

describe('PropertyExpensesComponent', () => {
  let component: PropertyExpensesComponent;
  let fixture: ComponentFixture<PropertyExpensesComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyExpensesComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyExpensesComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
