import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
	selector: 'app-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

	text = ''

	constructor(private spinnerService: SpinnerService) {
		this.spinnerService.event
			.subscribe(res => {
				this.text = res
			})
	}

	ngOnInit() {

	}

}
