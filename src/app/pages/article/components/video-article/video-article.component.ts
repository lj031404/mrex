import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { throwError } from 'rxjs';
import { catchError, flatMap, take } from 'rxjs/operators';
import { VideosService as ApiVideoiService } from '@app/api_generated/api/videos.service'
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharingDlgComponent } from '@app/shared/components/social-sharing-dlg/social-sharing-dlg.component';
import { ArticleListItem } from '@app/api_generated';
const ARTICLE_LIST_TOP_HEIGHT = 106

@Component({
  selector: 'app-video-article',
  templateUrl: './video-article.component.html',
  styleUrls: ['./video-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoArticleComponent implements OnInit, OnChanges {
  @Input() articleInformation
  @Input() close: () => void
  @ViewChild('mediaArticle', {static: true}) private mediaArticle: ElementRef<HTMLElement>
  @ViewChild('paginationView', {static: false}) private paginationView: ElementRef<HTMLElement>
  @ViewChild('recommendedArticle', {static: false}) private recommendedArticle: ElementRef<HTMLElement>


  videoId = ''
  player
  recommandedVideos: ArticleListItem[] = []
  isLoadMore: boolean
  isMoreDescription = true
  loadMoreCount = 0
  disableLoadMore: boolean
  loading: boolean
  articleCardHeight = 98;
  
  constructor(
    private spinnerService: SpinnerService,
    private videoService: ApiVideoiService,
    private layoutService: LayoutService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.mediaArticle.nativeElement.addEventListener('scroll', this.scrollHandler.bind(this), true)
  }

  ngOnChanges() {
    this.recommandedVideos = []
    this.getDetailInformation()
  }

  getDetailInformation() {
    if (this.articleInformation && this.articleInformation.id) {
      this.loadMoreCount = 0
      this.loading = true

      try {
        this.videoId = this.articleInformation.videoUrl.split('?v=')[1].split('&t=')[0]
      } catch (err){}
   
      this.videoService.getVideo(this.articleInformation.id).pipe(
        take(1),
        flatMap((res) => {
          this.articleInformation = {
            ...this.articleInformation,
            ...res
          }

          try {
            this.videoId = this.articleInformation.videoUrl.split('?v=')[1].split('&t=')[0]
          } catch (err){}

          this.loadMoreCount = 1
          return this.videoService.getRecommendedVideos(this.articleInformation.id, 0, 10)
        }),
        catchError((err: HttpErrorResponse) => {
          this.spinnerService.hide()
          this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 3000, 'error')
          this.close()
          this.loading = false
            return throwError(err)
          })
      ).subscribe(
        res => {
          this.recommandedVideos = res.map(video => ({
            ...video,
            type: 'video'
          }))
          this.disableLoadMore = this.recommandedVideos.length < 10
          this.spinnerService.hide()
          this.loading = false
          this.changeDetectorRef.detectChanges()
        }
      )
    
    }
  }

  loadMore() {
    this.isLoadMore = true
    this.videoService.getRecommendedVideos(this.articleInformation.id, this.loadMoreCount * 10, 10).pipe(take(1))
    .subscribe(
      res => {
        this.recommandedVideos = this.recommandedVideos.concat(res.map(article => ({
          ...article,
          type: 'video'
        })))
        this.disableLoadMore = res.length < 10
        this.loadMoreCount ++
        this.isLoadMore = false
      }, err => {
        this.isLoadMore = false
      }
    )
  }

  selectRecommendArticle(evt) {
    this.articleInformation = evt
    this.mediaArticle.nativeElement.scrollTo(0, 0)
    this.getDetailInformation()
  }

  openSocialShareDlg(article) {
    this.layoutService.openModal(SocialSharingDlgComponent, {
      data: article
    })
  }

  onScrollIndexChange(scrollIndex) {
   if (scrollIndex + 10 > this.recommandedVideos.length) {
     if (!this.isLoadMore && !this.disableLoadMore) {
       this.loadMore()
     }
   }
 }

  scrollHandler() {
    if (this.paginationView.nativeElement.getBoundingClientRect().top < ARTICLE_LIST_TOP_HEIGHT) {
      this.recommendedArticle.nativeElement.classList.add('fixed-title')
      document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.add('overflow-auto')
    } else {
      this.recommendedArticle.nativeElement.classList.remove('fixed-title')
      document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.remove('overflow-auto')
    }

    const target = this.mediaArticle.nativeElement
    if (target) {
      if (target.offsetHeight + Math.round(target.scrollTop)>= target.scrollHeight) {
        document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.add('overflow-auto')
      } else {
        document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.remove('overflow-auto')
      }
    }
  }

  ngOnDestroy() {
    this.mediaArticle.nativeElement.removeEventListener("scroll", this.scrollHandler.bind(this), true);
  }

}
