import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPadComponent } from './filter-pad.component';

describe('FilterPadComponent', () => {
  let component: FilterPadComponent;
  let fixture: ComponentFixture<FilterPadComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ FilterPadComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(FilterPadComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
