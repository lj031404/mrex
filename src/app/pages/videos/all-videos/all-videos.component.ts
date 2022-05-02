import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoListItem } from '@app/api_generated';
import { HomeService } from '@app/core/services/home.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-all-videos',
  templateUrl: './all-videos.component.html',
  styleUrls: ['./all-videos.component.scss']
})
export class AllVideosComponent implements OnInit, OnDestroy {
  socialVideos: VideoListItem[] = []
  allVideos: VideoListItem[] = []
  isMore: boolean;
  currentTab = 'shows'

  constructor(
    private homeService: HomeService,
    private spinnerService: SpinnerService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getVideos()
    window.addEventListener('scroll', this.scrollHandler.bind(this), true)
  }

  scrollHandler() {
		const target = document.getElementsByClassName('all-videos')[0]
		if (target) {
			const offsetHeight = document.getElementsByClassName("all-videos")["0"].offsetHeight
     	if (offsetHeight + Math.round(target.scrollTop) >= target.scrollHeight) {
        if (!this.isMore) {
					this.loadMore()
				}
			}

		}
	}

  ngOnDestroy() {
    window.removeEventListener("scroll", this.scrollHandler.bind(this), true);
  }

  async getVideos() {
    this.spinnerService.show()
    this.spinnerService.text = this.translate.instant('spinner.loading Video')

    try {
      const socialVideos = await this.homeService.getAllSocialVideos(0, 10).toPromise()
      const allVideos = await this.homeService.getAllVideos(0 , 10).toPromise()
      
      this.socialVideos = socialVideos.map(video => ({
        ...video,
        type: 'video'
      }))
  
      this.allVideos = allVideos.map(video => ({
        ...video,
        type: 'video'
      }))
  
      this.spinnerService.hide()
    } catch (error) {
      this.spinnerService.hide()
    }
   
  }

  async loadMore() {
    this.isMore = true
    try {
      if (this.currentTab !== 'shows') {
        this.socialVideos = this.socialVideos.concat(await this.homeService.getAllSocialVideos(this.socialVideos.length, 5, true).toPromise()).map(video => ({
          ...video,
          type: 'video'
        }))
      } else {
        this.allVideos = this.allVideos.concat(await this.homeService.getAllVideos(this.allVideos.length, 5, true).toPromise()).map(video => ({
          ...video,
          type: 'video'
        }))
      }

      this.isMore = false
    } catch (error) {
      this.isMore = false
    }
  }

  switchTab(tab: string) {
    this.currentTab = tab
  }

}
