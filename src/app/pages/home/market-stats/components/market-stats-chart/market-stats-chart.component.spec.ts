import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketStatsChartComponent } from './market-stats-chart.component';

describe('MarketStatsChartComponent', () => {
  let component: MarketStatsChartComponent;
  let fixture: ComponentFixture<MarketStatsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketStatsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketStatsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
