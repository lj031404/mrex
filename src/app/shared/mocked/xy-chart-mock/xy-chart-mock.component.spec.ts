import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XyChartMockComponent } from './xy-chart-mock.component';

describe('XyChartMockComponent', () => {
  let component: XyChartMockComponent;
  let fixture: ComponentFixture<XyChartMockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XyChartMockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XyChartMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
