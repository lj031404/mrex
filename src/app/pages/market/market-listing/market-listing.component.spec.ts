import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketListingComponent } from './market-listing.component';

describe('MarketListingComponent', () => {
  let component: MarketListingComponent;
  let fixture: ComponentFixture<MarketListingComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ MarketListingComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(MarketListingComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
