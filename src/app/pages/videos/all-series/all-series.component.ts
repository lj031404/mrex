import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { PlaylistItem } from '@app/api_generated/model/playlistItem';
import { Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
import { TabsStatesService } from '@app/shared/services/tabs-states.service';
import { filter } from 'rxjs/operators';
import { MediaService } from '@app/shared/services/media.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-all-series',
  templateUrl: './all-series.component.html',
  styleUrls: ['./all-series.component.scss']
})
export class AllSeriesComponent implements OnInit {
  @ViewChild('content', { static: true }) private content: ElementRef<HTMLElement>
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewPort: CdkVirtualScrollViewport

  playList: PlaylistItem[] = []
  isMore: boolean
  loadMoreCount = 0;
  disableLoadMore: boolean
  emptyVideos = ['','','','','', '']
  articleCardHeight = 98

  constructor(
    private layoutService: LayoutService,
    private translate: TranslateService,
    private router: Router,
    private tabsStatesService: TabsStatesService,
    private mediaService: MediaService
  ) {
   }

  ngOnInit() {
    this.getPlaylist()

     // Route enter and leave subscriptions
		this.tabsStatesService.enter$.pipe(filter(url =>  url === RouterMap.Videos.url([RouterMap.Videos.playlist]))).subscribe(url => {
      this.viewPort.scrollToIndex(0.01, "smooth")
		})

		this.tabsStatesService.leave$.pipe(filter(url => url === RouterMap.Videos.url([RouterMap.Videos.playlist]))).subscribe(url => {
      this.tabsStatesService.save('playlist', this.content.nativeElement.scrollTop)
		})
  }

  async getPlaylist() {
    try {
      const playlist = await this.mediaService.getPlaylists(this.playList ? this.playList.length : 0, 10).toPromise()
      this.disableLoadMore = playlist.length < 10
      this.playList = playlist ? playlist : []
     
      this.loadMoreCount ++
    } catch (error) {
      this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
    }
  }

  async loadMore() {
    this.isMore = true
    try {
      const playlist = await this.mediaService.getPlaylists(this.loadMoreCount * 10, 10).toPromise()
      this.playList = this.playList.concat(playlist)
      this.disableLoadMore = playlist.length < 10
      this.loadMoreCount ++
      this.isMore = false
    } catch (error) {
      this.isMore = false
      this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
    }
  }

  openPlayListVideosDlg(playlist: PlaylistItem) {
    this.router.navigate([RouterMap.Videos.path, RouterMap.Videos.playlist, playlist.id])
  }

  onScrollIndexChange(evt) {
  
    if (evt + 10 > this.playList.length) {
      if (!this.disableLoadMore && !this.isMore) {
        this.loadMore()
      }
    }
  }
}
