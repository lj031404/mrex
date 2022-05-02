import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@app/layout/layout.module';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';

import { PipesModule } from '@app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { VideoArticleComponent } from './components/video-article/video-article.component';
import { BlogArticleComponent } from './components/blog-article/blog-article.component';
import { RecomendedArticleComponent } from './components/recomended-article/recomended-article.component';
import { MediaArticleCardComponent } from './components/media-article-card/media-article-card.component';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [
    ArticleComponent, 
    VideoArticleComponent, 
    BlogArticleComponent, 
    RecomendedArticleComponent,
    MediaArticleCardComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    TranslateModule,
    LayoutModule,
    ButtonsModule,
    PipesModule,
    FormsModule,
    SharedModule,
    NgxIonicImageViewerModule,
    IonicModule,
    ScrollingModule
  ],
  exports: [
    ArticleComponent,
    MediaArticleCardComponent
  ],
  entryComponents: [
    ArticleComponent
  ]
})
export class ArticleModule { }
