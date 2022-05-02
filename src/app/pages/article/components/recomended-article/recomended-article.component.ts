import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MediaArticleCard, MediaArticleType } from '@app-core/models/mediaArticleCard';

@Component({
  selector: 'app-recommended-article',
  templateUrl: './recomended-article.component.html',
  styleUrls: ['./recomended-article.component.scss']
})
export class RecomendedArticleComponent implements OnChanges {
  @Input() article: MediaArticleCard
  @Output() selectRecommendArticle: EventEmitter<MediaArticleCard> = new EventEmitter();
  videoId = ''
    
  ngOnChanges() {
    if (this.article && this.article.videoUrl) {
      this.videoId = this.article.videoUrl.split('?v=')[1]
    }
  }
  
  showArticle() {
     this.selectRecommendArticle.emit({
      ...this.article,
      type: this.article.type === 'video' ? MediaArticleType.Video : MediaArticleType.Article,
    })
	}
}
