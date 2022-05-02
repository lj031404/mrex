import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { BanksParametersService, Logo } from '@app/shared/services/banks-parameters.service';

@Component({
	selector: 'app-banks-selector',
	templateUrl: './banks-selector.component.html',
	styleUrls: ['./banks-selector.component.scss']
})
export class BanksSelectorComponent implements OnInit {

	@Input() itemClick: Function
	@Input() onReset: Function
	@Input() activeItem: string
	@Input() title: string
	@Input() excludeBank?: string[] = []
	@Input() showResetButton = true
	@Input() disabledBanks: string[] = []

	banks = []

	constructor() { }

	ngOnInit() {
		this.banks = BanksParametersService.logos.filter(x => !this.excludeBank.includes(x.name))
	}

	bankClick(item: string) {
		if (this.disabledBanks.includes(item)) {
			return
		}
		this.itemClick(item)
	}

	reset() {
		this.onReset()
	}

	ngOnChange(changes: SimpleChange) {
		console.log(changes)
	}

}
