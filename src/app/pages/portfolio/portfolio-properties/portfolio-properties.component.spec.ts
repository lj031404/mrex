import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioPropertiesComponent } from './portfolio-properties.component';

describe('PortfolioPropertiesComponent', () => {
  let component: PortfolioPropertiesComponent;
  let fixture: ComponentFixture<PortfolioPropertiesComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PortfolioPropertiesComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PortfolioPropertiesComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
