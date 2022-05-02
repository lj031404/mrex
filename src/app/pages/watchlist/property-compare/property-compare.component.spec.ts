import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCompareComponent } from './property-compare.component';

describe('PropertyCompareComponent', () => {
  let component: PropertyCompareComponent;
  let fixture: ComponentFixture<PropertyCompareComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyCompareComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyCompareComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
