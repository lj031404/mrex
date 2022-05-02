import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInfoComponent } from './purchase-info.component';

describe('PurchaseInfoComponent', () => {
  let component: PurchaseInfoComponent;
  let fixture: ComponentFixture<PurchaseInfoComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PurchaseInfoComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PurchaseInfoComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
