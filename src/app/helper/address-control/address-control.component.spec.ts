import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressControlComponent } from './address-control.component';

describe('AddressControlComponent', () => {
  let component: AddressControlComponent;
  let fixture: ComponentFixture<AddressControlComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ AddressControlComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(AddressControlComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
