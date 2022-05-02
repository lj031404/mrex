import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyIrrHistogramComponent } from './property-irr-histogram.component';

describe('PropertyIrrHistogramComponent', () => {
  let component: PropertyIrrHistogramComponent;
  let fixture: ComponentFixture<PropertyIrrHistogramComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyIrrHistogramComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyIrrHistogramComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
