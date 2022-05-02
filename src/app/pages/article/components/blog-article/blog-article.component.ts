import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MediaArticleType } from '@app-core/models/mediaArticleCard';
import { BlogService as ApiBlogService } from '@app/api_generated/api/blog.service';
import { LayoutService } from '@app/layout/service/layout.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { catchError, flatMap, take } from 'rxjs/operators';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { SocialSharingDlgComponent } from '@app/shared/components/social-sharing-dlg/social-sharing-dlg.component';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { ModalController } from '@ionic/angular';
import { ArticleListItem } from '@app/api_generated';
const ARTICLE_LIST_TOP_HEIGHT = 106
@Component({
  selector: 'app-blog-article',
  templateUrl: './blog-article.component.html',
  styleUrls: ['./blog-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogArticleComponent implements OnInit, OnDestroy, OnChanges {
  @Input() articleInformation
  @Input() close: () => void
  @ViewChild('blogArticle', {static: true}) private blogArticle: ElementRef<HTMLElement>
  @ViewChild('imageViewer', {static: false}) private imageViewer: ElementRef<HTMLElement>
  @ViewChild('paginationView', {static: false}) private paginationView: ElementRef<HTMLElement>
  @ViewChild('recommendedArticle', {static: false}) private recommendedArticle: ElementRef<HTMLElement>

  isLoading: boolean
  recommendedArticles: ArticleListItem[] = []
  isLoadMore: boolean
  loadMoreCount = 0
  disableLoadMore: boolean
	articleCardHeight = 98

  constructor(
    private blogService: ApiBlogService,
    private spinnerService: SpinnerService,
    private layoutService: LayoutService,
    private translate: TranslateService,
    private settingsMiddleware: UserSettingsMiddlewareService,
    private changeDetectorRef: ChangeDetectorRef,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.blogArticle.nativeElement.addEventListener('scroll', this.scrollHandler.bind(this), true)
  }

  ngOnChanges() {
    this.loadMoreCount = 0
    this.getArticleData()
  }
  
  loadMore() {
    this.isLoadMore = true
    this.blogService.getRecommendedArticles(this.articleInformation.id, this.loadMoreCount * 10, 10).pipe(take(1))
    .subscribe(
      res => {
        this.recommendedArticles = this.recommendedArticles ? this.recommendedArticles.concat(res) : res
        this.disableLoadMore = res.length < 10
        this.isLoadMore = false
        this.loadMoreCount ++
      }, err => {
        this.isLoadMore = false
      }
    )
  }

  selectRecommendArticle(evt) {
    this.articleInformation = evt
    this.blogArticle.nativeElement.scrollTo(0, 0)
    this.getArticleData()
  }

  getArticleData() {
    if (this.articleInformation && this.articleInformation.id) {
      this.blogService.getArticle(this.articleInformation.id).pipe(
        take(1),
        flatMap((res) => {
          this.articleInformation = {
            ...this.articleInformation,
            ...res
          }

          if (this.articleInformation.html) {
            const index = this.settingsMiddleware.language !== 'fr-CA' ? this.articleInformation.html.indexOf('<h3>About the author</h3>') :
              this.articleInformation.html.indexOf("propos de ") ;
            
            this.articleInformation = {
              ...this.articleInformation,
              html: this.settingsMiddleware.language !== 'fr-CA' ? this.articleInformation.html.slice(0, index) : this.articleInformation.html.slice(0, index - 3)
            }
          }
          
          return this.blogService.getRecommendedArticles(this.articleInformation.id, 0 , 10)
        }),
        catchError((err: HttpErrorResponse) => {
          this.spinnerService.hide()
          this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 3000, 'error')
          this.close()
          return throwError(err)
        })
      ).subscribe(
        res => {
          this.recommendedArticles = res.map(article => ({
            ...article,
            type: MediaArticleType.Article
          }))
          this.loadMoreCount = 1
          this.disableLoadMore = this.recommendedArticles.length < 10
          this.spinnerService.hide()
          
          setTimeout(() => this.addClickEventsOnImages())
          
          this.changeDetectorRef && this.changeDetectorRef.detectChanges()
        }
      )
    }
  }

  openSocialShareDlg(article) {
    this.layoutService.openModal(SocialSharingDlgComponent, {
      data: article
    })
  }

  addClickEventsOnImages() {
    Array.prototype.forEach.call(document.getElementsByClassName('wp-block-image'), (el) => {
      el.addEventListener('click', async (evt) => {
        const modal = await this.modalController.create({
          component: ViewerModalComponent,
          componentProps: {
            src: el.getElementsByTagName('img')[0].src,
            scheme: 'light',
            slideOptions: {
              allowTouchMove: false,
              loop: false,
              enabled: false,
            }
          },
          cssClass: 'ion-img-viewer',
          keyboardClose: true,
          showBackdrop: true
        });
     
        return await modal.present();
      })
    });
  }

  closeViewer() {
    let modal = document.getElementById("imageViewer");
    modal.style.display = "none";
  }

	onScrollIndexChange(scrollIndex) {
    if (scrollIndex + 10 > this.recommendedArticles.length) {
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

    const target = this.blogArticle.nativeElement
    if (target) {
      if (target.offsetHeight + Math.round(target.scrollTop)>= target.scrollHeight) {
        document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.add('overflow-auto')
      } else {
        document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.remove('overflow-auto')
      }
    }
	}

  ngOnDestroy() {
    this.blogArticle.nativeElement.removeEventListener("scroll", this.scrollHandler.bind(this), true);
  }

}
