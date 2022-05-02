import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPendingCardComponent } from './property-pending-card.component';

describe('PropertyPendingCardComponent', () => {
  let component: PropertyPendingCardComponent;
  let fixture: ComponentFixture<PropertyPendingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyPendingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPendingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
