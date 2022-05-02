import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendedArticleComponent } from './recomended-article.component';

describe('RecomendedArticleComponent', () => {
  let component: RecomendedArticleComponent;
  let fixture: ComponentFixture<RecomendedArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecomendedArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecomendedArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
