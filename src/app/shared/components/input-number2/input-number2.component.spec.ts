import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumber2Component } from './input-number2.component';

describe('InputNumber2Component', () => {
  let component: InputNumber2Component;
  let fixture: ComponentFixture<InputNumber2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputNumber2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNumber2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
