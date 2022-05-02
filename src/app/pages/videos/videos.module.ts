import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';

import { PipesModule } from '@app/shared/pipes/pipes.module';
// import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';

import { VideosRoutingModule } from './videos-routing.module';
import { VideosComponent } from './videos/videos.component';
import { AllVideosComponent } from './all-videos/all-videos.component';
import { ArticleModule } from '@app-pages/article/article.module';
import { AllSeriesComponent } from './all-series/all-series.component';
import { PlaylistItemComponent } from './playlist-item/playlist-item.component';
import { PlaylistvideosDlgComponent } from './playlistvideos-dlg/playlistvideos-dlg.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [VideosComponent, AllVideosComponent, AllSeriesComponent, PlaylistItemComponent, PlaylistvideosDlgComponent],
  imports: [
    CommonModule,
    TranslateModule,
    LayoutModule,
    ButtonsModule,
    PipesModule,
    // FormsModule,
    SharedModule,
    VideosRoutingModule,
    ArticleModule,
    ScrollingModule
  ],
  entryComponents: [
    PlaylistvideosDlgComponent
  ]
})
export class VideosModule { }
