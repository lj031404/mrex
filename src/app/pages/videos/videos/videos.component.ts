import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { VideosPortal } from '@app/api_generated/model/videosPortal';
import { HomeService } from '@app/core/services/home.service';
import { Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '@app/layout/service/layout.service';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { Subscription } from 'rxjs';

const ARTICLE_LIST_TOP_HEIGHT = 94

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {
  private subscription = new Subscription()
  videosPortal: VideosPortal = {
    latest: {},
    videos: []
  }
  videoId = ''
  isLoadMore: boolean
  emptyVideos = ['', '', '' , '' , '']
	articleCardHeight = 98

  @ViewChild('videoPortal', { static: true }) private videoPortal: ElementRef<HTMLElement>
  @ViewChild('trendingTitle', { static: true }) private trendingTitle: ElementRef<HTMLElement>
  @ViewChild('trendingVideos', { static: true }) private trendingVideos: ElementRef<HTMLElement>

  constructor(
    private homeService: HomeService,
    private router: Router,
    private translate: TranslateService,
    private layoutService: LayoutService,
    private settingsMiddleware: UserSettingsMiddlewareService,
  ) {
    this.subscription.add(this.settingsMiddleware.userLanguageSettingEvent.subscribe(() => this.getVideos()))
  }

  ngOnInit() {
    this.getVideos()
    this.videoPortal.nativeElement.addEventListener('scroll', this.scrollHandler.bind(this), true)
  }

  getVideos() {
    this.homeService.getVideoPortal(0, 10, true).pipe(take(1)).subscribe(
      res => {
        this.videosPortal = res;
        if (this.videosPortal && this.videosPortal.videos) {
          this.videosPortal.videos = this.videosPortal.videos.map(video => ({
            ...video,
            type: 'video',
            disableSocialShare: true
          }))
        }
        if (this.videosPortal && this.videosPortal.latest) {
          const videoId = this.videosPortal.latest.videoUrl.split('?v=')[1]
          this.videoId = videoId.split('&t=')[0]
        }
      }, err => {
      }
    )

  }
  
  showAll() {
    this.router.navigate([RouterMap.Videos.url([RouterMap.Videos.playlist])])
  }

  ngOnDestroy() {
		this.subscription.unsubscribe()
    this.videoPortal.nativeElement.removeEventListener("scroll", this.scrollHandler.bind(this), true);
	}

  scrollHandler() {
    if (this.trendingVideos.nativeElement.getBoundingClientRect().top < ARTICLE_LIST_TOP_HEIGHT) {
      this.trendingTitle.nativeElement.classList.add('fixed-tab')
      // Used document.getElementsByTagName since viewChild doesnt work well in this case.
      document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.add('overflow-auto')
    } else {
      this.trendingTitle.nativeElement.classList.remove('fixed-tab')
      document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.remove('overflow-auto')
    }

    const offsetHeight = this.videoPortal.nativeElement.offsetHeight
    if (offsetHeight + Math.round(this.videoPortal.nativeElement.scrollTop) >= this.videoPortal.nativeElement.scrollHeight) {
      // Used document.getElementsByTagName since viewChild doesnt work well in this case.
      document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.add('overflow-auto')
    } else {
      document.getElementsByTagName('cdk-virtual-scroll-viewport')[0].classList.remove('overflow-auto')
    }
  }


  loadMore() {
    this.isLoadMore = true
    this.homeService.getVideoPortal(this.videosPortal.videos.length, 10).pipe(take(1)).subscribe(
      res => {
        this.videosPortal.videos = this.videosPortal.videos.concat(res.videos).map(video => ({
          ...video,
          type: 'video',
          disableSocialShare: true
        }))
        this.isLoadMore = false
      }, err => {
        this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
        this.isLoadMore = false
      }
    )
  }

  onScrollIndexChange(evt) {
    if (evt + 10 > this.videosPortal.videos.length) {
      if (!this.isLoadMore) {
        this.loadMore()
      }
    }
  }
}
