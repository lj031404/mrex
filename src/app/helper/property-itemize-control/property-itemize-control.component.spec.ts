import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyItemizeControlComponent } from './property-itemize-control.component';

describe('PropertyItemizeControlComponent', () => {
  let component: PropertyItemizeControlComponent;
  let fixture: ComponentFixture<PropertyItemizeControlComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyItemizeControlComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyItemizeControlComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
