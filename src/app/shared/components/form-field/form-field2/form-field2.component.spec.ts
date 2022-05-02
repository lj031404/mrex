import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormField2Component } from './form-field2.component';

describe('FormField2Component', () => {
  let component: FormField2Component;
  let fixture: ComponentFixture<FormField2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormField2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormField2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
