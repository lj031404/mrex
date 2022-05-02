import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SocialSharingDlgComponent } from '@app-shared/components/social-sharing-dlg/social-sharing-dlg.component';
import { LayoutService } from '@app/layout/service/layout.service'
import { Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
@Component({
  selector: 'app-media-article-card',
  templateUrl: './media-article-card.component.html',
  styleUrls: ['./media-article-card.component.scss']
})
export class MediaArticleCardComponent implements OnInit, OnChanges {
  @Input() article
  videoId = ''
  constructor(
    public layoutService: LayoutService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.article && this.article.videoUrl) {
      const videoId = this.article.videoUrl.split('?v=')[1]
      this.videoId = videoId.split('&t=')[0]
    }
  }

  showArticle() {
    this.router.navigate([RouterMap.Articles.ARTICLES], {
			queryParams: {
				id: this.article.id,
				type: this.article['type'] === 'video' ? 'video' : 'article'
			}
		})
	}
  
  openSocialShareDlg(article) {
    const modalRef = this.layoutService.openModal(SocialSharingDlgComponent, {
      data: article
    })
  }

}
