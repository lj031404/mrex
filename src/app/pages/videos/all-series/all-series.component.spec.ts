import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSeriesComponent } from './all-series.component';

describe('AllSeriesComponent', () => {
  let component: AllSeriesComponent;
  let fixture: ComponentFixture<AllSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
