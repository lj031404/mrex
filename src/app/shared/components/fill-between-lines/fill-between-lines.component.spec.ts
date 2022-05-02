import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillBetweenLinesComponent } from './fill-between-lines.component';

describe('FillBetweenLinesComponent', () => {
  let component: FillBetweenLinesComponent;
  let fixture: ComponentFixture<FillBetweenLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillBetweenLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillBetweenLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
