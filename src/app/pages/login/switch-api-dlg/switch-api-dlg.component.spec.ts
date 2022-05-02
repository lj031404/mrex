import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchApiDlgComponent } from './switch-api-dlg.component';

describe('SwitchApiDlgComponent', () => {
  let component: SwitchApiDlgComponent;
  let fixture: ComponentFixture<SwitchApiDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchApiDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchApiDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
