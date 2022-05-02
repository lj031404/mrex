import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
import { Subject } from 'rxjs';
import { delay, filter, map, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})

export class TabsStatesService {

	public states = {
		'home': {},
		'market': {},
		'watchlist': {},
		'portfolio': {},
		'marketMap': {},
		'playlist': {}
	}

	private currentUrl: string = '/' + RouterMap.Home.path

	enter$: Subject<string> = new Subject()
	leave$: Subject<string> = new Subject()

	constructor(private router: Router) {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd && event.url !== this.currentUrl),
			map((event: NavigationEnd) => event.url),
			tap((url) => this.currentUrl = url),
			// This timeout is purely arbitrary and is caused by the DOM to not be ready after 
			// the navigation has ended (due to transitions?)
			delay(50)
		).subscribe((url) => {
			this.enter$.next(url)
		})

		this.router.events.pipe(
			//tap((event: any) => console.log(event.url)),
			filter(event => event instanceof NavigationStart && event.url !== this.currentUrl),
			map((event: NavigationStart) => this.currentUrl),
		).subscribe((url) => {
			this.leave$.next(url)
		})
	}

	public save(name: string, states) {
		this.states[name] = states
	}

	public get(name: string) {
		return this.states[name]
	}

}
