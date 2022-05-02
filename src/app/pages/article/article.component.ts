import { Component, OnDestroy, Input, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { HomeService } from '@app-core/services/home.service'
import { Subscription, throwError } from 'rxjs'
import { ModalRef } from '@app-models/modal-ref'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Location } from '@angular/common'
import { filter, take } from 'rxjs/operators'
import { RouterMap } from '@app/core/utils/router-map.util'

@Component({
	selector: 'app-article',
	templateUrl: './article.component.html',
	styleUrls: ['./article.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent implements OnInit {
	@Input() modalRef: ModalRef
	@Input() data: {
		id: string,
		type: string
	} = {
			id: '',
			type: ''
		}

	isLoading: boolean
	allArticles = []
	articleId = ''
	articleInformation
	subscription: Subscription = new Subscription()

	constructor(
		private homeService: HomeService,
		private changeDetectorRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private location: Location,
		private router: Router
	) {
		router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			filter((event: NavigationEnd) => event.url.includes(RouterMap.Articles.path)),
		).subscribe(async (event) => {
			console.log(event)
			this.activatedRoute.queryParams.pipe(take(1))
				.subscribe(async ({ id, type }) => {
					this.articleInformation = {
						...this.articleInformation,
						type,
						id
					}
					await this.getMedia()
					this.changeDetectorRef.detectChanges()
				})
		})
	}

	ngOnInit() {
	}

	async getMedia() {
		if (!this.homeService.allArticles.length) {
			this.allArticles = await this.homeService.getArticleVideos()
			this.homeService.allArticles = this.allArticles
		}
		setTimeout(() => {
			this.changeDetectorRef.detectChanges()
		})
	}

	back = () => {
		this.location.back()
	}

}
