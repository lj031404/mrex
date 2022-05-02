import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { PortfolioPropertyStatus } from '@app/core/models/portfolio.interface';
import { TranslateService } from '@ngx-translate/core';
import { ReceiveOfferStatusType } from '@app-models/portfolio.interface'
import { PropertyType } from '@app-models/property.interface'
import { PortfolioPropertyShort } from '@app/api_generated/model/portfolioPropertyShort';
import { PropertyAddressPipe } from '@app-pipes/property-address.pipe'
import { fromEvent, merge } from 'rxjs'
import { skipUntil, takeUntil, map, tap, filter } from 'rxjs/operators'

@Component({
	selector: 'app-property-card',
	templateUrl: './property-card.component.html',
	styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent implements OnInit, OnChanges {
	ReceivePurchaseToOfferTypes = ReceiveOfferStatusType
	ReceivePurchaseToOfferKeys = Object.keys(ReceiveOfferStatusType)

	PropertyType = PropertyType
	propertyOptionKeys = Object.keys(PropertyType)

	@Input() portfolioCard: PortfolioPropertyShort
	@Input() countModels: number
	@Input() slidable?= true
	@Input() onDelete
	@Input() onPropertyClicked: Function = () => { }

	selectedValue: string
	propertyStatus: any[];
	offerStatus = ''

	first: string
	second: string
	propertyAddressPipe = new PropertyAddressPipe()

	transformXValue = 'translateX(0)'
	mouseX: number
	mouseY: number
	sub: any
	box
	mousedown$
	mouseup$

	touchstart$
	touchend$

	deltaX: number
	deltaY: number
	prevX: number
	prevY: number
	touchend = true
	mouseXEnd: number = 0
	deltaXEnd: number = 0

	@ViewChild('sliderCard', { static: true }) sliderCard: ElementRef

	constructor(
		private translate: TranslateService
	) { }

	ngOnInit() {
		this.selectedValue = this.translate.instant(PortfolioPropertyStatus.public_sale)
		this.propertyStatus = [
			this.translate.instant(PortfolioPropertyStatus.public_sale),
			this.translate.instant(PortfolioPropertyStatus.open_offer),
		]
		this.initSlider()

		this.first = this.propertyAddressPipe.transform(this.portfolioCard.address, 'first')
		this.second = this.propertyAddressPipe.transform(this.portfolioCard.address, 'second')
	}

	ngOnChanges() {
		if (this.portfolioCard) {
			this.offerStatus = this.translate.instant(`page.portfolio.summary.${this.portfolioCard.receiveOfferStatus}`)
		}
	}

	setStatus(status: string) {
		return status
	}

	matSelectEvent($event) {
		$event.preventDefault()
		$event.stopPropagation()
	}

	delete() {
		this.onDelete(this.portfolioCard)
	}

	initSlider() {
		// ------------------- Slider card -------------------
		this.box = this.sliderCard.nativeElement

		// Touch events
		this.touchstart$ = fromEvent(this.box, 'touchstart')
		this.touchend$ = fromEvent(this.box, 'touchend')
		this.touchend$.subscribe(_ => this.register())

		// Mouse events
		this.mousedown$ = fromEvent(this.box, 'mousedown')
		this.mouseup$ = fromEvent(this.box, 'mouseup')
		this.mouseup$.subscribe(_ => this.register())

		this.register()
	}

	// Ref: https://stackblitz.com/edit/angular-mousemove-after-mouse-down
	register() {
		if (!this.slidable) {
			return
		}

		try {
			this.sub.unsubscribe()
		} catch (err) { }

		// Touch event
		let touchmove$ = fromEvent(this.box, 'touchmove')
		touchmove$ = touchmove$.pipe(
			skipUntil(this.touchstart$),
			takeUntil(this.touchend$),
			map((e: any) => {
				return {
					mouseX: e.touches[0].clientX,
					mouseY: e.touches[0].clientY
				}
			}))

		// Mouse events
		let mousemove$ = fromEvent(this.box, 'mousemove')
		mousemove$ = mousemove$.pipe(
			skipUntil(this.mousedown$),
			takeUntil(this.mouseup$),
			map((e: any) => {
				return {
					mouseX: e.clientX,
					mouseY: e.clientY
				}
			}))

		merge(this.touchend$, this.mouseup$).subscribe((e) => {
			this.touchend = true
			this.mouseXEnd = this.prevX
			this.deltaXEnd = this.deltaX
		})

		this.sub = merge(touchmove$, mousemove$).pipe(
			filter(({ mouseX, mouseY }) => {

				if (this.touchend) {
					this.prevX = mouseX
					this.prevY = mouseY
					this.touchend = false
				}

				const deltaX = mouseX - this.prevX
				this.deltaX = this.deltaXEnd + deltaX
				this.deltaY = mouseY - this.prevY

				return Math.abs(deltaX) > Math.abs(this.deltaY)
			}),
			tap(() => console.log('subscribe')),
		).subscribe((res: any) => {
			// do not move more than 50% the width of the card
			if (this.deltaX < -0.5 * this.sliderCard.nativeElement.offsetWidth) {
			}
			// snap to initial position
			else if (this.deltaX > 0) {
				this.transformXValue = 'translateX(0px)'
			}
			else {
				this.transformXValue = 'translateX(' + this.deltaX + 'px)'
			}
		})
	}
}
