import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySearchDrawerComponent } from './property-search-drawer.component';

describe('PropertySearchComponent', () => {
  let component: PropertySearchDrawerComponent;
  let fixture: ComponentFixture<PropertySearchDrawerComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertySearchDrawerComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertySearchDrawerComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
