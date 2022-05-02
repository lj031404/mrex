import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyModelOverviewComponent } from './property-model-overview.component';

describe('PropertyModelOverviewComponent', () => {
  let component: PropertyModelOverviewComponent;
  let fixture: ComponentFixture<PropertyModelOverviewComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyModelOverviewComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyModelOverviewComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
