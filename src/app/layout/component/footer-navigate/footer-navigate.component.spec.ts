import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterNavigateComponent } from './footer-navigate.component';

describe('FooterNavigateComponent', () => {
  let component: FooterNavigateComponent;
  let fixture: ComponentFixture<FooterNavigateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterNavigateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterNavigateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
