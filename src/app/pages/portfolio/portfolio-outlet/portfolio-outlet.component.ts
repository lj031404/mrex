import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'

import { ModalRef } from '@app-models/modal-ref'
import { PropertySearchDrawerEvent } from '@app-models/property-search.interface'
import { ActionDrawerComponent } from '@app/layout/component/action-drawer/action-drawer.component'
import { ActionDrawerOutletComponent } from '@app/layout/component/action-drawer-outlet/action-drawer-outlet.component'
import { LayoutService } from '@app/layout/service/layout.service'
import { Router } from '@angular/router'
import { RouterMap } from '@app/core/utils/router-map.util'
import { PortfolioLocalService } from '@app/core/localDB/portfolio.service'
import { TranslateService } from '@ngx-translate/core'
import { GlobalService } from '@app/core/services/global.service'
import { PortfolioPropertyAction } from '@app/core/models/portfolioEvent.enum'
import { Subscription } from 'rxjs'
@Component({
	selector: 'app-portfolio-outlet',
	templateUrl: './portfolio-outlet.component.html',
	styleUrls: ['./portfolio-outlet.component.scss']
})
export class PortfolioOutletComponent implements OnInit, OnDestroy {
	@ViewChild('mainDrawer', {static: true}) mainDrawer: ActionDrawerComponent
	@ViewChild('propertySearchDrawerWrapper', {static: true}) propertySearchDrawer: ActionDrawerComponent
	@ViewChild('drawerOutlet', {static: true}) drawerOutlet: ActionDrawerOutletComponent

	activePropertySearchDrawer = false

	propertyAddModalRef: ModalRef
	isShowAddBtn: boolean
	sub: Subscription = new Subscription()

	constructor(
		private layoutService: LayoutService,
		private portfolioLocalService: PortfolioLocalService,
		private router: Router,
		private translate: TranslateService,
		public globalService: GlobalService
	) {}

	async ngOnInit() {

		this.sub.add(
			this.globalService.portfolioEvent.subscribe((evt: PortfolioPropertyAction) => {
				if (evt === PortfolioPropertyAction.OpenDrawer) {
					this.addPropertySearchDrawer()
				}
				if (evt === PortfolioPropertyAction.HideDrawerBtn) {
					this.isShowAddBtn = false
				} else if (evt === PortfolioPropertyAction.ShowDrawerBtn) {
					this.isShowAddBtn = true
				}
			})
		)
		
	}

	createProperty() {
		if (this.mainDrawer) {
			this.mainDrawer.close()
		}
		if (this.propertySearchDrawer) {
			this.addPropertySearchDrawer()
			this.propertySearchDrawer.open()
		}
	}

	importFromWatchlist() {
	}

	closePropertySearchDrawer() {
		this.drawerOutlet.closeDrawers();
	}

	onPropertySearchDrawerWrapperClosed() {
		this.removePropertySearchDrawer();
	}

	// TODO: Add or Remove Component by using ViewContainerRef
	addPropertySearchDrawer() {
		this.activePropertySearchDrawer = true
		this.drawerOutlet.openDrawer()
	}

	removePropertySearchDrawer() {
		this.activePropertySearchDrawer = false
	}

	onPropertySearchDrawerEventEmitted(event: PropertySearchDrawerEvent) {
		this.closePropertySearchDrawer()
		if(this.portfolioLocalService.portfolioPros.map(prop => prop.propertyId).includes(event.data.id)){
			this.layoutService.openSnackBar(this.translate.instant('portfolio.summary.cannot-add-double'), null, 5000, 'error')
		} else {
			if (event) {
				this.router.navigate([RouterMap.Portfolio.url([RouterMap.Portfolio.NEW])], {
					queryParams: {
						step: 1,
						propertyId: event.data.id ? event.data.id : undefined,
						propertyData: JSON.stringify(event.data)
					}
				})
			}
		}
	}

	clickAdd() {
		this.router.navigate(['/portfolio/new'])
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}
}
