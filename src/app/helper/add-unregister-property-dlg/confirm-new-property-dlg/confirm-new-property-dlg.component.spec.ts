import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNewPropertyDlgComponent } from './confirm-new-property-dlg.component';

describe('ConfirmNewPropertyDlgComponent', () => {
  let component: ConfirmNewPropertyDlgComponent;
  let fixture: ComponentFixture<ConfirmNewPropertyDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmNewPropertyDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmNewPropertyDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
