import { Component, OnInit, Input } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-home-news',
  templateUrl: './home-news.component.html',
  styleUrls: ['./home-news.component.scss']
})
export class HomeNewsComponent implements OnInit {
	@Input() news = []

	public config: SwiperConfigInterface = {
		a11y: true,
		direction: 'horizontal',
		slidesPerView: 1,
		keyboard: true,
		mousewheel: true,
		scrollbar: false,
		navigation: true,
		pagination: false
	};

	private pagination: SwiperPaginationInterface = {
		el: '.swiper-pagination',
		clickable: true,
		hideOnClick: false
	};

	constructor() {}

	ngOnInit() {
		this.config.scrollbar = false;
		this.config.navigation = false;

		this.config.pagination = this.pagination;
	}

}
