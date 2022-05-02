import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCollapseComponent } from './chart-collapse.component';

describe('ChartCollapseComponent', () => {
  let component: ChartCollapseComponent;
  let fixture: ComponentFixture<ChartCollapseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartCollapseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
