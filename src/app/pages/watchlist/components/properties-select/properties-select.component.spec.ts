import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesSelectComponent } from './properties-select.component';

describe('PropertiesSelectComponent', () => {
  let component: PropertiesSelectComponent;
  let fixture: ComponentFixture<PropertiesSelectComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PropertiesSelectComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PropertiesSelectComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
