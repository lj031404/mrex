import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartMockComponent } from './line-chart-mock.component';

describe('LineChartMockComponent', () => {
  let component: LineChartMockComponent;
  let fixture: ComponentFixture<LineChartMockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartMockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
