import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeOfInterestButtonComponent } from './notice-of-interest-button.component';

describe('NoticeOfInterestButtonComponent', () => {
  let component: NoticeOfInterestButtonComponent;
  let fixture: ComponentFixture<NoticeOfInterestButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeOfInterestButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeOfInterestButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
