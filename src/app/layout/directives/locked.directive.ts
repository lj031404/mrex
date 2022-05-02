import { Directive, Input, OnInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../service/layout.service';

@Directive({
  selector: '[appLockedDirective]'
})
export class LockedDirective implements OnInit, OnDestroy {

	@Input() title: string
	@Input() text?: string
	@Input() locked = false

	buttonLabel: string

	subscription = new Subscription()
	constructor(
		public translate: TranslateService,
		public el: ElementRef,
		public render: Renderer2,
		public layoutService: LayoutService
	) {
	 }

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}

	async ngOnInit() {
		this.popUpRequireScreen()
	}

	async popUpRequireScreen() {

		if (this.locked) {
			const blurElement = this.el.nativeElement
			const childElement = document.createElement('div');
			childElement.innerHTML = `
				<div class="locked">
					<div class="lock-signup">
						<div><img src="assets/icon-lock_white.png" width="66" height="66" ></div>
					</div>
					<div class="lock-description ml-2">
					<div class="lock-description__title mb-1">${this.title}</div>
					<div class="lock-description__detail" >
						${this.text}
					</div>
					</div>
				</div>`
			blurElement.classList.add('locked-blur')
			childElement.classList.add('locked-directive')
			blurElement.prepend(childElement)
		}
		else {
			this.hideRequireScreen()
		}

	}

	hideRequireScreen() {
		const blurElement = this.el.nativeElement
		const directives = blurElement.querySelectorAll('.locked-directive')
		directives.forEach(d => d.remove())
		blurElement.classList.remove('locked-directive2')
	}

}
