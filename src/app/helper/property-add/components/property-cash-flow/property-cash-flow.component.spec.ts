import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCashFlowComponent } from './property-cash-flow.component';

describe('PropertyCashFlowComponent', () => {
  let component: PropertyCashFlowComponent;
  let fixture: ComponentFixture<PropertyCashFlowComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyCashFlowComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyCashFlowComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
