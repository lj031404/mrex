import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NGXLogger } from 'ngx-logger'
import { debounceTime, take, takeWhile, tap } from 'rxjs/operators'

import { ModelPropertyShort, SearchPropertyCriteriaGeoAddress, SearchService, Address } from '@app/api_generated'
import { PropertySearchDrawerEvent, PropertySearchDrawerEventType } from '@app-models/property-search.interface'
import { PropertySearchDataSource } from '@app/helper/property-search-data-source'
import * as _ from 'lodash';
import { ModelPropertyShortDb } from '@app/core/models/modelPropertyShortDb'
import { AddUnregisterPropertyDlgComponent } from '../add-unregister-property-dlg/add-unregister-property-dlg.component'
import { MatDialog } from '@angular/material'
import { LayoutService } from '@app/layout/service/layout.service'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { RouterMap } from '@app/core/utils/router-map.util'
import { UnregisterTypes } from '@app/core/models/unregister.interface'
import { PropertyPendingService } from '@app-services/property-pending.service'
import { PropertyPendingEvent } from '@app-models/propertyPendingEvent.enum'

@Component({
	selector: 'app-property-search-drawer',
	templateUrl: './property-search-drawer.component.html',
	styleUrls: ['./property-search-drawer.component.scss']
})
export class PropertySearchDrawerComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() maxHeight = 500
	@Input() ignoreProviders?
	@Output() cast = new EventEmitter<PropertySearchDrawerEvent>()

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef<HTMLInputElement>
	@ViewChild('searchcontainer', { static: true }) searchcontainer: ElementRef<HTMLInputElement>

	searchForm: FormGroup
	propertyDataSource = new PropertySearchDataSource()

	debounce = 500

	alive = true
	firstLoad = true

	toggleSearch: boolean = false
	innerHeight: any

	constructor(
		private formBuilder: FormBuilder,
		private searchService: SearchService,
		private logger: NGXLogger,
		public dialog: MatDialog,
		public layoutService: LayoutService,
		private translate: TranslateService,
		private router: Router,
		private propertyPendingService: PropertyPendingService,
	) { }

	ngOnInit() {
		this.innerHeight = window.innerHeight;
		this.searchForm = this.formBuilder.group({
			search: ['', [Validators.required, Validators.min(5)]]
		})

		this.searchForm.get('search').valueChanges.pipe(
			tap(() => {
				if (this.firstLoad) {
					this.firstLoad = false;
				}
			}),
			debounceTime(this.debounce),
			takeWhile(() => this.alive)
		).subscribe(value => {
			if (value) {
				this.search(value)
			}
		})

		this.propertyDataSource.pageSize = 50
		this.propertyDataSource.loadMore.pipe(
			debounceTime(this.debounce),
			takeWhile(() => this.alive)
		).subscribe(({ offset, limit }) => {
			this.loadMore(offset, limit)
		})
	}

	ngOnDestroy() {
		this.alive = false
	}

	ngAfterViewInit(): void {
		if (this.searchInput) {
			setTimeout(() => {
				this.searchInput.nativeElement.focus()
			})
		}
	}

	onResize(event: any) {
		const screenHeight = event.target.innerHeight
		this.innerHeight = window.innerHeight;
		// Walk around for the native keyboard which pushes the drawer too high
		if (screenHeight < this.maxHeight) {
			this.maxHeight = screenHeight
		}
	}

	convertPXToVW(px) {
		let height = 100 * (px / this.innerHeight)
		return 100 - height;
	}

	search(addressStr: string) {
		const request: SearchPropertyCriteriaGeoAddress = {
			address: addressStr,
			criteria: {}
		}

		this.propertyDataSource.clear()

		this.searchService.searchNearPropertiesByAddress(request)
			.subscribe((response: ModelPropertyShort[]) => {
				if (this.ignoreProviders && this.ignoreProviders.length) {
					response = response.filter(x => !this.ignoreProviders.includes(x.provider))
				}
				this.propertyDataSource.next(response)
			})
	}

	searchByAddressString() {
		this.searchService.getAddressObjectFromString(this.searchForm.get('search').value)
			.subscribe((address: Address) => {
				console.log('[Property Search Drawer] Received address object', address)
				this.createProperty({ address })
			})
	}

	loadMore(offset: number, limit: number) {
		const request: SearchPropertyCriteriaGeoAddress = {
			address: this.searchForm.get('search').value,
			criteria: {},
			pagination: {
				limit,
				skip: offset
			}
		}

		this.searchService.searchNearPropertiesByAddress(request)
			.subscribe((response: ModelPropertyShort[]) => {
				console.log('[Property Search Drawer] Received property search result', response)
				if (this.ignoreProviders && this.ignoreProviders.length) {
					response = response.filter(x => !this.ignoreProviders.includes(x.provider))
				}
				this.propertyDataSource.next(response)
			})
	}

	importFromDatabase(property: ModelPropertyShortDb) {
		this.cast.emit({
			type: PropertySearchDrawerEventType.IMPORT,
			data: property
		})
	}

	createProperty(data: any) {
		this.cast.emit({
			type: PropertySearchDrawerEventType.CREATE,
			data
		})
	}

	get getDataSource() {
		return _.get(this.propertyDataSource, '_total')
	}

	addUnregisterProperty() {
		let data
		if (this.router.url.includes('watchlist')) {
			this.createProperty({})
			return
		}
		else if (this.router.url.includes('portfolio')) {
			data = {
				title: this.translate.instant('helper.add_unregister_property.add_unregister_property'),
				descriptiveText: this.translate.instant('helper.add_unregister_property.add_unregister_description'),
				goBack: {
					label: this.translate.instant('helper.add_unregister_property.confirm_dlg.go_back_portfolio'),
					route: `/${RouterMap.Portfolio.path}`
				},
				type: UnregisterTypes.Portfolio,
				submit: {
					label: this.translate.instant('helper.add_unregister_property.confirm_dlg.portfolio_add_another'),
				}
			}
			this.propertyPendingService.sendEvent(PropertyPendingEvent.PendingPropertyOpened)
			this.layoutService.openModal(AddUnregisterPropertyDlgComponent, {
				data
			}).closed$.subscribe(res => {
				this.cast.emit()
			})
		}
	}
	searchClose() {
		this.searchForm.controls['search'].setValue('')
		this.toggleSearch = false;
	}
}
