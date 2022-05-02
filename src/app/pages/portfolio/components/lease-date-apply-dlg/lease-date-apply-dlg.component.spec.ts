import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseDateApplyDlgComponent } from './lease-date-apply-dlg.component';

describe('LeaseDateApplyDlgComponent', () => {
  let component: LeaseDateApplyDlgComponent;
  let fixture: ComponentFixture<LeaseDateApplyDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaseDateApplyDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseDateApplyDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
