import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter } from '@angular/core'
import { skipUntil, takeUntil, map, tap, filter } from 'rxjs/operators'

import { fromEvent, merge, of } from 'rxjs'
import { ModalRef } from '@app/core/models/modal-ref'
import { _translate } from '@app/core/utils/translate.util'
import { ListingType } from '@app/api_generated'
import { PropertyAddressPipe } from '@app-pipes/property-address.pipe'
import { ListingDoc } from '@app/core/localDB/listings.service'

@Component({
	selector: 'app-property-card',
	templateUrl: './property-card.component.html',
	styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent implements OnInit {

	@Input() item: ListingDoc
	@Input() slidable = true
	@Input() onDelete
	@Input() countModels

	cashflow: number
	caprate: number

	transformXValue = 'translateX(0)'
	moveXValue = 0
	lastXVal = 0
	isDragging = false

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

	propertyAddModalRef: ModalRef

	propertyFormComplete: EventEmitter<any> = new EventEmitter<any>()

	subscription

	ListingType = ListingType

	@ViewChild('sliderCard', { static: true }) sliderCard: ElementRef

	constructor() { }
	@Input() onPropertyClicked: Function = () => { }

	first: string
	second: string
	propertyAddressPipe = new PropertyAddressPipe()

	ngOnInit() {
		this.initSlider()
		this.first = this.propertyAddressPipe.transform(this.item.address, 'first')
		this.second = this.propertyAddressPipe.transform(this.item.address, 'second')
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
			})
		)

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
			})
		)

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

	delete() {
		this.onDelete(this.item)
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

}
