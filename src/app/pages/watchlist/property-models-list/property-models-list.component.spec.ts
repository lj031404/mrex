import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyModelsListComponent } from './property-models-list.component';

describe('PropertyModelingComponent', () => {
  let component: PropertyModelsListComponent;
  let fixture: ComponentFixture<PropertyModelsListComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertyModelsListComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertyModelsListComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
