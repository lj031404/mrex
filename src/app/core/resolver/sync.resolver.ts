import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'

import { SyncService } from '@app-services/sync.service'
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service'
import { RouterMap } from '../utils/router-map.util'

@Injectable({
	providedIn: 'root'
})
export class SyncResolver implements Resolve<boolean> {

	constructor(
		private syncService: SyncService,
		private router: Router,
		private middleware: MarketMiddlewareService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if (this.syncService.isSynced) {			
			return of(true)
		} else {
			this.router.navigate(['loading'], { state: {
				syncingData: {
					wasLoading: state.url
				}
			} })
			return of(null)
		}
	}
}
