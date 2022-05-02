import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksSelectorComponent } from './banks-selector.component';

describe('BanksSelectorComponent', () => {
  let component: BanksSelectorComponent;
  let fixture: ComponentFixture<BanksSelectorComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ BanksSelectorComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(BanksSelectorComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
