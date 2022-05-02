import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancingChartComponent } from './financing-chart.component';

describe('FinancingChartComponent', () => {
  let component: FinancingChartComponent;
  let fixture: ComponentFixture<FinancingChartComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ FinancingChartComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(FinancingChartComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
