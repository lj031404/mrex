import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingHistoryComponent } from './listing-history.component';

describe('ListingHistoryComponent', () => {
  let component: ListingHistoryComponent;
  let fixture: ComponentFixture<ListingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
