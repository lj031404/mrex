import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketSavedComponent } from './market-saved.component';

describe('MarketSavedComponent', () => {
  let component: MarketSavedComponent;
  let fixture: ComponentFixture<MarketSavedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketSavedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
