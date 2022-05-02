import { RouteReuseStrategy } from '@angular/router/'
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router'

export class CacheAppRouteReuseStrategy implements RouteReuseStrategy {
	handlers: { [key: string]: DetachedRouteHandle } = {}

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		if (route.data.shouldDetach === 'no') {
			return false
		}
		return true
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
		this.handlers[this.getKey(route)] = handle
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		return !!this.getKey(route) && !!this.handlers[this.getKey(route)]
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
		if (!this.getKey(route)) {
			return null
		}
		return this.handlers[this.getKey(route)]
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		return this.getKey(future) === this.getKey(curr)
	}

	getKey(route: ActivatedRouteSnapshot) {
		if (route.routeConfig === null) {
			return ''
		}
		else if (route.firstChild) {
			return this.getKey(route.firstChild)
		}
		else {
			return route.data.key || route.routeConfig.path
		}
	}
}