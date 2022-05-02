import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialSharingDlgComponent } from './social-sharing-dlg.component';

describe('SocialSharingDlgComponent', () => {
  let component: SocialSharingDlgComponent;
  let fixture: ComponentFixture<SocialSharingDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialSharingDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialSharingDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
