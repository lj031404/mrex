import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyActivityComponent } from './property-activity.component';

describe('PropertyActivityComponent', () => {
  let component: PropertyActivityComponent;
  let fixture: ComponentFixture<PropertyActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
