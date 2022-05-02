import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartMockComponent } from './pie-chart-mock.component';

describe('PieChartMockComponent', () => {
  let component: PieChartMockComponent;
  let fixture: ComponentFixture<PieChartMockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartMockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
