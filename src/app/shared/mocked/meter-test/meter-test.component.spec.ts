import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterTestComponent } from './meter-test.component';

describe('MeterTestComponent', () => {
  let component: MeterTestComponent;
  let fixture: ComponentFixture<MeterTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
