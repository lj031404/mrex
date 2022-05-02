import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioPropertyComponent } from './portfolio-property.component';

describe('PortfolioPropertyComponent', () => {
  let component: PortfolioPropertyComponent;
  let fixture: ComponentFixture<PortfolioPropertyComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PortfolioPropertyComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PortfolioPropertyComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
