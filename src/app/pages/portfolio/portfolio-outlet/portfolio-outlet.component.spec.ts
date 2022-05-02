import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioOutletComponent } from './portfolio-outlet.component';

describe('PortfolioOutletComponent', () => {
  let component: PortfolioOutletComponent;
  let fixture: ComponentFixture<PortfolioOutletComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PortfolioOutletComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PortfolioOutletComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
