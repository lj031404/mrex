import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSalesComparisonComponent } from './advanced-sales-comparison.component';

describe('AdvancedSalesComparisonComponent', () => {
  let component: AdvancedSalesComparisonComponent;
  let fixture: ComponentFixture<AdvancedSalesComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSalesComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSalesComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
