import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthStep1Component } from './step1.component';

describe('OauthStep1Component', () => {
  let component: OauthStep1Component;
  let fixture: ComponentFixture<OauthStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OauthStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
