import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideosComponent } from './videos/videos.component';
import { AllVideosComponent } from './all-videos/all-videos.component';
import { AllSeriesComponent } from './all-series/all-series.component';
import { PlaylistvideosDlgComponent } from './playlistvideos-dlg/playlistvideos-dlg.component'
import { RouterMap } from '@app/core/utils/router-map.util';

const routes: Routes = [
  { path: '', component: VideosComponent },
  { path: RouterMap.Videos.all, component: AllVideosComponent, pathMatch: 'full', data: { key: RouterMap.Videos.all } },
  { path: RouterMap.Playlist.path, component: AllSeriesComponent, pathMatch: 'full', data: { key: RouterMap.Playlist.path } },
  { path: RouterMap.Playlist.playlist, component: PlaylistvideosDlgComponent, pathMatch: 'full', data: { key: RouterMap.Playlist.playlist } },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
