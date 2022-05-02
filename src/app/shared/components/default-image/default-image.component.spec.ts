import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultImageComponent } from './default-image.component';

describe('DefaultImageComponent', () => {
  let component: DefaultImageComponent;
  let fixture: ComponentFixture<DefaultImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
