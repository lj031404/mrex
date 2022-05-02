import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnregisterPropertyDlgComponent } from './add-unregister-property-dlg.component';

describe('AddUnregisterPropertyDlgComponent', () => {
  let component: AddUnregisterPropertyDlgComponent;
  let fixture: ComponentFixture<AddUnregisterPropertyDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnregisterPropertyDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnregisterPropertyDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
