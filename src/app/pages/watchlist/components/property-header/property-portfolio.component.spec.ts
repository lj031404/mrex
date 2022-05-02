import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyHeaderComponent } from './property-header.component';

describe('PropertyPortfolioComponent', () => {
  let component: PropertyHeaderComponent;
  let fixture: ComponentFixture<PropertyHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
