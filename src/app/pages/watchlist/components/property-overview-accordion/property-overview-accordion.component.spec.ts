import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyOverviewAccordionComponent } from './property-overview-accordion.component';

describe('PropertyOverviewAccordionComponent', () => {
  let component: PropertyOverviewAccordionComponent;
  let fixture: ComponentFixture<PropertyOverviewAccordionComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyOverviewAccordionComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyOverviewAccordionComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
