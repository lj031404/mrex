import { Injectable } from '@angular/core';
import { VideosService } from '@app/api_generated/api/videos.service'
import { AppStorage } from '@app-core/services/storage'


@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(
    private videoService: VideosService
  ) { }

  getPlaylists(skip = 0, limit = 10, fetchApi = false) {
    return AppStorage.cache(
      `getPlaylist_${skip}_${limit}`,
      this.videoService.getPlaylists(skip, limit),
      fetchApi
    )
  }
}
