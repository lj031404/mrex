import { Directive, Input, OnInit, ElementRef, OnDestroy, Renderer2, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { UserService } from '@app-core/localDB/user.service';
import { Subscription } from 'rxjs';
import { PlansService } from '@app/shared/services/plans.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from '../service/layout.service';
import { RouterMap } from '@app/core/utils/router-map.util';

@Directive({
  selector: '[appSubscriptionRequire]'
})
export class SubscriptionRequireDirective implements OnInit, OnDestroy, OnChanges {

	@Input() featureName?: string
	@Input() ruleId: string
	@Input() userPlan?: string
	@Input() show = true

	currentPlan: string
	buttonLabel: string
	text: string
	title: string

	subscription = new Subscription()
	constructor(
		public translate: TranslateService,
		public el: ElementRef,
		public render: Renderer2,
		private userService: UserService,
		private plansService: PlansService,
		private router: Router,
		private readonly route: ActivatedRoute,
		private element: ElementRef,
		public layoutService: LayoutService
	) {
	 }

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}

	async ngOnInit() {
		// If no ruleId defined, do nothing
		if (this.ruleId) {
			this.buttonLabel = this.translate.instant('layout.directives.subscription-require.upgrade')
			const { upgradeRequired, requiredPlan, requiredPlanLabel } = await this.plansService.minimumRequiredPlan(this.ruleId)
			this.title = this.translate.instant('page.subscription.require_title', { planName: requiredPlanLabel })
			this.text = this.translate.instant('page.subscription.require_text', { featureName: this.featureName, planName: requiredPlanLabel })
			this.popUpRequireScreen()
		}
	}

	@HostListener('click', ['$event']) async goto(event: any) {
		if (event.target.className === 'btn mt-1') {
			// url to return after subscription is done
			const redirect = this.router.url

			const { upgradeRequired, requiredPlan } = await this.plansService.minimumRequiredPlan(this.ruleId)
			await this.router.navigate([ RouterMap.Subscription.path ], { queryParams: { plan: requiredPlan, redirect }, replaceUrl: true })
				.then(() => new Promise(resolve => setTimeout(resolve, 500)))
			this.layoutService.closeAllModals()
		}
	}

	async popUpRequireScreen() {
		const userDbInfo = await this.userService.getUserInfo()
		this.currentPlan = userDbInfo.subscription.plan
		const { upgradeRequired, requiredPlan } = await this.plansService.minimumRequiredPlan(this.ruleId)

		if (upgradeRequired && this.show) {
			const blurElement = this.el.nativeElement
			const childElement = document.createElement('div');
			childElement.innerHTML = `<div class="require-subscription">
					<div class="lock-signup">
						<div><img src="assets/icon-lock.png" width="66" height="66" ></div>
						<a class="btn mt-1">${this.buttonLabel}</a>
					</div>
					<div class="lock-description ml-2">
					<div class="lock-description__title mb-1">${this.title}</div>
					<div class="lock-description__detail" >
						${this.text}
					</div>
					</div>
				</div>`
			blurElement.classList.add('subscription-require-directive')
			childElement.classList.add('subscription-directive')
			blurElement.prepend(childElement)
		}
		else {
			this.hideRequireScreen()
		}

	}

	hideRequireScreen() {
		const blurElement = this.el.nativeElement
		const directives = blurElement.querySelectorAll('.subscription-directive')
		directives.forEach(d => d.remove())
		blurElement.classList.remove('subscription-require-directive')
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes && changes.show && changes.show.previousValue !== undefined) {
			this.show = changes && changes.show && changes.show.currentValue
			this.popUpRequireScreen()
		}
	}

}
