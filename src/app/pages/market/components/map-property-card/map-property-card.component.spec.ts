import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPropertyCardComponent } from './map-property-card.component';

describe('MapPropertyCardComponent', () => {
  let component: MapPropertyCardComponent;
  let fixture: ComponentFixture<MapPropertyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPropertyCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPropertyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
