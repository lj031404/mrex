import { CollectionViewer, DataSource } from '@angular/cdk/collections'
import { EventEmitter } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { takeWhile } from 'rxjs/operators'

export class PropertyDataSource<T> extends DataSource<T | undefined> {

	protected _alive = true
	protected _pageSize = 20
	protected _total = 0
	protected _allLoaded = false
	protected _lock = false
	public data$: BehaviorSubject<(T | undefined)[]> = new BehaviorSubject<(T|undefined)[]>([])

	loadMore = new EventEmitter<{ offset: number; limit: number; }>()
	reachEnd = new BehaviorSubject<boolean>(false)

	set pageSize(size: number) {
		this._pageSize = size
	}

	constructor() {
		super()
	}

	connect(collectionViewer: CollectionViewer): Observable<(T | undefined)[] | ReadonlyArray<T | undefined>> {
		collectionViewer.viewChange
			.pipe(takeWhile(() => this._alive))
			.subscribe(range => {
				if (range.end > this._total - 10 && !this._allLoaded && !this._lock && this._total) {
					this.loadMore.emit({
						offset: this._total,
						limit: this._pageSize
					})
					this._lock = true
				}
			})
		return this.data$
	}

	disconnect(collectionViewer: CollectionViewer) {
		this._alive = false
	}

	next(data: (T | undefined)[], overwrite?: boolean) {
		let newData

		if (overwrite === true) {
			newData = data || []
		} else {
			newData = [
				... this.data$.value,
				... (data || [])
			]
		}

		if (data.length < this._pageSize) {
			this._allLoaded = true
		}
		this._total = newData.length
		this._lock = false
		this.data$.next(newData)
	}

	clear() {
		this._total = 0
		this._allLoaded = false
		this.data$.next([])
		this.reachEnd.next(false)
	}
}
