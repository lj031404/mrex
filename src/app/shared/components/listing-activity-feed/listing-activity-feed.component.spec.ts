import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingActivityFeedComponent } from './listing-activity-feed.component';

describe('ListingActivityFeedComponent', () => {
  let component: ListingActivityFeedComponent;
  let fixture: ComponentFixture<ListingActivityFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingActivityFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingActivityFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
