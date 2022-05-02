import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioNew3Component } from './portfolio-new3.component';

describe('PortfolioNew3Component', () => {
  let component: PortfolioNew3Component;
  let fixture: ComponentFixture<PortfolioNew3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioNew3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioNew3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
