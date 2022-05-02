import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramChartMockComponent } from './histogram-chart-mock.component';

describe('HistogramChartMockComponent', () => {
  let component: HistogramChartMockComponent;
  let fixture: ComponentFixture<HistogramChartMockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramChartMockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramChartMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
