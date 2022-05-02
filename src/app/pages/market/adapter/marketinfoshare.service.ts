import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MarketinfoshareService {

	public inputAddress = new BehaviorSubject<string>('')
	inputAddress$ = this.inputAddress.asObservable()

	public inputSearchAddress = new BehaviorSubject<string>('')
	inputSearchAddress$ = this.inputSearchAddress.asObservable()

	public filterCriterial = new BehaviorSubject<any>('')
	filterCriterial$ = this.filterCriterial.asObservable()

	constructor() { }

	getInputAddress(address: string) {
		this.inputAddress.next(address)
	}

	getFilterCriterial(filters: any) {
		this.filterCriterial.next(filters)
	}

	getInputSearchAddress(address: string) {
		this.inputSearchAddress.next(address)
	}
}
