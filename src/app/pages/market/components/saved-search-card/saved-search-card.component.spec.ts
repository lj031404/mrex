import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSearchCardComponent } from './saved-search-card.component';

describe('SavedSearchCardComponent', () => {
  let component: SavedSearchCardComponent;
  let fixture: ComponentFixture<SavedSearchCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedSearchCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
