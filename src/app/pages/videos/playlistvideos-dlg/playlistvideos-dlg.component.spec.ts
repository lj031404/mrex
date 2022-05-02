import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistvideosDlgComponent } from './playlistvideos-dlg.component';

describe('PlaylistvideosDlgComponent', () => {
  let component: PlaylistvideosDlgComponent;
  let fixture: ComponentFixture<PlaylistvideosDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistvideosDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistvideosDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
