import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MarketService as MarketApiService } from '@app/api_generated/api/market.service'
import { debounceTime, takeWhile, take, filter } from 'rxjs/operators';
import * as _ from 'lodash'

interface Address {
	place_id: string
	description: string
}
@Component({
	selector: 'app-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
	form: FormGroup

	@ViewChild('input', { static: true })
	public input: ElementRef

	@ViewChild('list', { static: true })
	public listElement: ElementRef

	@Input() icon?: string
	@Input() placeholder: string
	@Input() address: string
	@Input() isAutoFocus?: boolean = false

	addresses: Address[] = []
	selectedPlaceId = ''

	@Output() chosenAddress = new EventEmitter()
	@Output() chosenPlace = new EventEmitter()

	constructor(
		private marketApiService: MarketApiService,
		public formBuilder: FormBuilder,) { }

	ngOnInit() {
		this.form = this.formBuilder.group({
			address: [this.address]
		})

		this.form.get('address').valueChanges.pipe(
			filter(key => !!key),
			debounceTime(500),
			takeWhile(() => Boolean(this.input)))
			.subscribe(async (text) => {
				this.addresses = await this.marketApiService.autocomplete(text).toPromise()
			})


		// Listener for click outside
		this.onDocumentClick = this.onDocumentClick.bind(this)
		document.addEventListener('click', this.onDocumentClick)
	}

	public ngOnDestroy() {
		document.removeEventListener('click', this.onDocumentClick)
	}

	protected onDocumentClick(event: MouseEvent) {
		if (this.listElement && this.listElement.nativeElement.contains(event.target)) {
			return
		}

		// clicked outside
		this.addresses = []
	}

	click(i: number) {
		this.marketApiService.getPlaceIdDetails(this.addresses[i].place_id)
			.pipe(take(1))
			.subscribe((res) => {
				this.chosenPlace.emit(res)
			})
		this.selectedPlaceId = this.addresses[i].place_id

		this.chosenAddress.emit(this.addresses[i])
		this.address = this.addresses[i].description
		this.form.setValue({
			address: this.address
		}, { emitEvent: false })
		this.addresses = []
	}

	clear() {
		this.address = ''
		this.form.get('address').setValue('')
		this.addresses = []
		this.chosenAddress.emit(null)
	}

}
