import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPropertyTypesComponent } from './all-property-types.component';

describe('AllPropertyTypesComponent', () => {
  let component: AllPropertyTypesComponent;
  let fixture: ComponentFixture<AllPropertyTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPropertyTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPropertyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
