import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPortfolioComponent } from './your-portfolio.component';

describe('YourPortfolioComponent', () => {
  let component: YourPortfolioComponent;
  let fixture: ComponentFixture<YourPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
