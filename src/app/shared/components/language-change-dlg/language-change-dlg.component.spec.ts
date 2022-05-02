import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageChangeDlgComponent } from './language-change-dlg.component';

describe('LanguageChangeDlgComponent', () => {
  let component: LanguageChangeDlgComponent;
  let fixture: ComponentFixture<LanguageChangeDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageChangeDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageChangeDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
