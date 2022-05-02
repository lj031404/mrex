import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMoneyChartComponent } from './property-money-chart.component';

describe('PropertyMoneyChartComponent', () => {
  let component: PropertyMoneyChartComponent;
  let fixture: ComponentFixture<PropertyMoneyChartComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyMoneyChartComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyMoneyChartComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
