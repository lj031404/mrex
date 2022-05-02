import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesComparisonOverviewComponent } from './sales-comparison-overview.component';

describe('SalesComparisonOverviewComponent', () => {
  let component: SalesComparisonOverviewComponent;
  let fixture: ComponentFixture<SalesComparisonOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesComparisonOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComparisonOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
