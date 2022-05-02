import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { RouterMap } from '@app/core/utils/router-map.util'
import { ModalRef } from '@app-models/modal-ref'
import { PropertyLocalData } from '@app-models/property.interface'
import { PropertiesService } from '@app/core/localDB/properties.service'
import { LayoutService } from '@app/layout/service/layout.service'
import { PropertyAddComponent } from '@app/helper/property-add/property-add.component'
import { PropertyFormConfig } from '@app/helper/property-form-config'
import { Subscription, Subject } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { _translate } from '@app/core/utils/translate.util'

@Component({
	selector: 'app-property-overview',
	templateUrl: './property-overview.component.html',
	styleUrls: ['./property-overview.component.scss']
})
export class PropertyOverviewComponent implements OnInit, OnDestroy {

	PropertyMap = RouterMap.Watchlist
	propertyId: string
	propertyUrl: string

	_propertyDoc: PropertyLocalData
	_propertyDoc$ = new Subject<PropertyLocalData>()
	isLoading = false

	subscription: Subscription

	propertyFormComplete = new EventEmitter<any>()
	propertyAddModalRef: ModalRef

	constructor(
		private propertiesService: PropertiesService,
		private layoutService: LayoutService,
		private route: ActivatedRoute,
		private translate: TranslateService,
		private router: Router
	) {
	}

	navigateToListScreen = () => {
		this.router.navigate([RouterMap.Watchlist.url([])])
	}

	async ngOnInit() {
		this.propertyId = this.route.snapshot.paramMap.get('id')
		this.propertyUrl = this.PropertyMap.url([this.propertyId])
		await this.refreshProperty()
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}

	async refreshProperty(): Promise<void> {
		const result = this.propertiesService.getPropertyByDocId(this.propertyId)
		console.log('[Property Overview Component] Get Property {', this.propertyId, '} from local', result)
		this._propertyDoc = result as PropertyLocalData
		this._propertyDoc$.next(this._propertyDoc)
	}

	editProperty() {
		const config = new PropertyFormConfig()
		console.log(this._propertyDoc)
		config.init(this._propertyDoc.propertyData, this._propertyDoc.hypothesisData)

		this.propertyAddModalRef = this.layoutService.openModal(PropertyAddComponent, {
			config: config,
			complete: this.propertyFormComplete
		}, false)
	}

	async deleteProperty(): Promise<void> {
		await this.propertiesService.deletePropertyByDocId(this.propertyId)
		this.layoutService.openSnackBar(_translate(this.translate.instant('page.watchlist.property-overview.remove')), null, 3000, 'info', false)
		this.router.navigate([ RouterMap.Watchlist.path ], {replaceUrl: true})
	}

}
