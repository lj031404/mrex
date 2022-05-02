import { Injectable } from '@angular/core';
import Loki from 'lokijs'
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LokijsService {

	db: Loki
	isReady$ = new BehaviorSubject<boolean>(false)

	constructor() {
		this.db = new Loki('mrex')
		this.isReady$.next(true)
	}

	clear() {
		this.db = new Loki('mrex')
		console.log('DB cleared')
		this.isReady$.next(true)
	}
}
