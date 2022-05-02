import { Injectable, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
	providedIn: 'root'
})
export class SpinnerService {

	public event: EventEmitter<string> = new EventEmitter()
	public isLoading = false

	constructor(private spinner: NgxSpinnerService) { }

	public set text(val) {
		this.event.emit(val)
	}

	public show(duration = 0, start = 500) {
		this.isLoading = true

		// start the spinner after 500 ms
		setTimeout(() => {
			if (this.isLoading) {
				this.spinner.show()
			}
		}, start)

		if (duration) {
			setTimeout(() => {
				/** spinner ends after 5 seconds */
				this.spinner.hide()
			}, duration * 1000)
		}
	}

	public hide() {
		this.spinner.hide()
		this.text = ''
		this.isLoading = false
	}
}
