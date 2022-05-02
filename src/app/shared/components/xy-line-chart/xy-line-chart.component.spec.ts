import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XyLineChartComponent } from './xy-line-chart.component';

describe('XyLineChartComponent', () => {
  let component: XyLineChartComponent;
  let fixture: ComponentFixture<XyLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XyLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XyLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
