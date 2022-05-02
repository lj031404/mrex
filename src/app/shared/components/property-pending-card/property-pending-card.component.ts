import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UnregisteredProperty } from '@app/api_generated';
import { PropertyAddressPipe } from '@app/shared/pipes/property-address.pipe';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, merge } from 'rxjs'
import { skipUntil, takeUntil, map, tap, filter } from 'rxjs/operators'
interface PendingPropertyEntity extends UnregisteredProperty {
	portfolioStatus?: string,
	createdAt?: string
}
@Component({
	selector: 'app-property-pending-card',
	templateUrl: './property-pending-card.component.html',
	styleUrls: ['./property-pending-card.component.scss']
})


export class PropertyPendingCardComponent implements OnInit, OnChanges {
	@Input() pendingProperty: PendingPropertyEntity
	@Input() type?: string = this.translate.instant('market_listing_type.offMarket')
	@Input() showType?: boolean = false
	@Input() slidable?= true
	@Input() onDelete?
	@Input() onPropertyClicked?: Function = () => { }

	first: string
	second: string


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


	propertyAddressPipe = new PropertyAddressPipe()
	constructor(
		private translate: TranslateService
	) { }

	ngOnInit() {
		this.initSlider()
	}

	ngOnChanges() {
		if (this.pendingProperty) {
			this.first = this.propertyAddressPipe.transform(this.pendingProperty.address, 'first')
			this.second = this.propertyAddressPipe.transform(this.pendingProperty.address, 'second')
		}
	}

	delete() {
		this.onDelete(this.pendingProperty)
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
