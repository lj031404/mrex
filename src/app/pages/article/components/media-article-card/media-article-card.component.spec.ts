import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaArticleCardComponent } from './media-article-card.component';

describe('MediaArticleCardComponent', () => {
  let component: MediaArticleCardComponent;
  let fixture: ComponentFixture<MediaArticleCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaArticleCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaArticleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
