import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { Picture } from '@app/api_generated';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

export interface PictureSlider {
	pictures: Picture[]
	options?: any
}

@Component({
	selector: 'app-picture-slider',
	templateUrl: './picture-slider.component.html',
	styleUrls: ['./picture-slider.component.scss']
})
export class PictureSliderComponent implements OnInit, OnChanges {
	index = 2
	swiperConfig: SwiperConfigInterface = {
		slidesPerView: 1,
		navigation: true
	}

	@Input() slider: PictureSlider
	@Input() currentIndex?: number
	@Input() isImageBlur?: boolean = false
	@Output() clickedImgIdx: EventEmitter<number> = new EventEmitter()

	constructor() { }

	ngOnInit() {}

	ngOnChanges() {
		this.index = 2

		
		if (this.currentIndex > this.index) {
			this.index = this.currentIndex
		}
	}

	indexChanged(event) {
		if (this.slider && this.slider.pictures && this.slider.pictures.length > this.index) {
			this.index++
		}
	}

	viewImage(idx: number) {
		this.clickedImgIdx.emit(idx)
	}

}
