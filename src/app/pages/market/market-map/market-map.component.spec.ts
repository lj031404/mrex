import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketMapComponent } from './market-map.component';

describe('MarketMapComponent', () => {
  let component: MarketMapComponent;
  let fixture: ComponentFixture<MarketMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
