import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesComparablesComponent } from './sales-comparables.component';

describe('SalesComparablesComponent', () => {
  let component: SalesComparablesComponent;
  let fixture: ComponentFixture<SalesComparablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesComparablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComparablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
