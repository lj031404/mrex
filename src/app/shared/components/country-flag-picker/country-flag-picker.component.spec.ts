import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryFlagPickerComponent } from './country-flag-picker.component';

describe('CountryFlagPickerComponent', () => {
  let component: CountryFlagPickerComponent;
  let fixture: ComponentFixture<CountryFlagPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryFlagPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryFlagPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
