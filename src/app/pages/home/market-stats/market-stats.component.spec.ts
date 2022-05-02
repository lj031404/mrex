import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketStatsComponent } from './market-stats.component';

describe('MarketStatsComponent', () => {
  let component: MarketStatsComponent;
  let fixture: ComponentFixture<MarketStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
