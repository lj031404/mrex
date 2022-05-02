import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureSliderComponent } from './picture-slider.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ImageViewerDialogComponent } from './image-viewer-dialog/image-viewer-dialog.component';
import { LayoutModule } from '@app/layout/layout.module';
@NgModule({
	declarations: [PictureSliderComponent, ImageViewerDialogComponent],
	imports: [
		CommonModule,
		SwiperModule,
		SharedModule,
		TranslateModule,
		LayoutModule
	],
	exports: [
		PictureSliderComponent,
		ImageViewerDialogComponent
	],
	entryComponents: [
		ImageViewerDialogComponent
	]
})
export class PictureSliderModule { }
