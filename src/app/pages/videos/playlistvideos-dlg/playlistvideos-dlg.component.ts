import { Component, Input, OnInit } from '@angular/core';
import { ModalRef } from '@app-models/modal-ref'
import { PlaylistItem } from '@app/api_generated/model/playlistItem';
import { VideoListItem } from '@app/api_generated/model/videoListItem';

import { VideosService } from '@app/api_generated/api/videos.service'
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

const HEIGHT_ARTICLE_DESCRIPTION = 103
@Component({
  selector: 'app-playlistvideos-dlg',
  templateUrl: './playlistvideos-dlg.component.html',
  styleUrls: ['./playlistvideos-dlg.component.scss']
})
export class PlaylistvideosDlgComponent implements OnInit {
  @Input() modalRef: ModalRef
  @Input() data: PlaylistItem
  videoListItem: VideoListItem[]
  isMore: boolean
  loadMoreCount = 0
  isDisableLoadMore: boolean
  playListItem: PlaylistItem
  isMoreDescription = true
  isShowMoreBtn:Subject<boolean> = new BehaviorSubject(false)
  emptyVideos = ['','','','','','']
  sub

  constructor(
    private videoService: VideosService,
    private layoutService: LayoutService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private location: Location
  ) { 
    this.sub = this.route.params.subscribe(params => {
      this.data = {
        ...this.data,
        id: params['id']
      }
      if (this.data && this.data.id) {
        this.getPlayList()
        this.getPlayListVideos()
        window.addEventListener('scroll', this.scrollHandler.bind(this), true)
      }
    })
  }

  ngOnInit() {
  }


  async getPlayListVideos() {
    this.loadMoreCount = 0
    try {
      this.videoListItem = await this.videoService.getPlaylistVideos(this.data.id, 0, 10).toPromise()
      this.videoListItem = this.videoListItem.map(item => ({
        ...item,
        type: 'video',
        isPlayVideoItem: true
      }))
      this.isDisableLoadMore = this.videoListItem.length < 10
      this.loadMoreCount = 1
      this.isShowMoreBtn.next(this.visibleMore())
    } catch (error) {
      this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
    }
  }

  back = () => {
    this.playListItem = null
    this.videoListItem = []
    this.data.title = ''
    this.location.back()
  }

  ngOnDestroy() {
    window.removeEventListener("scroll", this.scrollHandler.bind(this), true);
  }

  scrollHandler() {
		const target:any = document.getElementsByClassName('playlist-videos-content')[0]
		if (target) {
			const offsetHeight = target.offsetHeight

      if (offsetHeight + Math.round(target.scrollTop) >= target.scrollHeight) {
        if (!this.isMore && !this.isDisableLoadMore) {
					this.loadMore()
				}
			}

		}
	}

  async loadMore() {
    this.isMore = true
    try {
      const playlist = await this.videoService.getPlaylistVideos(this.data.id, this.loadMoreCount * 10, 10).toPromise()
      this.videoListItem = this.videoListItem.concat(playlist).map(item => ({
        ...item,
        type: 'video',
        isPlayVideoItem: true
      }))

      this.isMore = false

      this.isDisableLoadMore = playlist.length < 10
      this.loadMoreCount ++

    } catch (error) {
      this.isMore = false
      this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
    }
  }

  async getPlayList() {
    try {
      this.playListItem = await this.videoService.getPlaylist(this.data.id).toPromise()
      this.data = {
        ...this.data,
        ...this.playListItem
      }
    } catch (error) {
      this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
    }
   
  }

  visibleMore() {
    const element = document.getElementById('articleDescription')
    if (element) {
      return element.offsetHeight > HEIGHT_ARTICLE_DESCRIPTION ? true :  false
    } else {
      return false
    }
  }

}
