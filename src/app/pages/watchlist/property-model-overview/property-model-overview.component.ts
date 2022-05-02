import { Component, OnInit, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Location } from '@angular/common';
import { PropertyLocalData } from '@app-models/property.interface'
import { PropertiesService } from '@app/core/localDB/properties.service'
import { RouterMap } from '@app/core/utils/router-map.util';
import { Subject } from 'rxjs';
import { ModalRef } from '@app/core/models/modal-ref';
import { LayoutService } from '@app/layout/service/layout.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { PropertyFormConfig } from '@app/helper/property-form-config';
import { PropertyAddComponent } from '@app/helper/property-add/property-add.component';
import { _translate } from '@app/core/utils/translate.util';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-property-model-overview',
	templateUrl: './property-model-overview.component.html',
	styleUrls: ['./property-model-overview.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyModelOverviewComponent implements OnInit, OnDestroy {

	PropertyMap = RouterMap.Watchlist

	modelDocId: string
	modelReportUrl: string
	propertyId: string
	redirect = ''

	_propertyDoc: PropertyLocalData
	_propertyDoc$ = new Subject<PropertyLocalData>()
	isLoading = false

	subscription: Boolean = true

	propertyFormComplete = new EventEmitter<any>()
	modalRef: ModalRef

	constructor(
		private propertiesService: PropertiesService,
		private layoutService: LayoutService,
		private route: ActivatedRoute,
		private spinnerService: SpinnerService,
		private translate: TranslateService,
		private router: Router,
		private location: Location,
		private changeDetectorRef: ChangeDetectorRef
	) {
		router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			filter((event: NavigationEnd) => event.url.includes(RouterMap.Watchlist.MODELING + '/')),
		).subscribe(() => {
			this.clear()
			this.onRouteChange()
		})
	}

	clear() {
		this._propertyDoc = undefined
	}

	async onRouteChange() {
		await this.refreshProperty()

		this.modelReportUrl = RouterMap.Watchlist.url([
			this.propertyId,
			RouterMap.Watchlist.MODELING,
			String(this._propertyDoc.$loki)
		])

		this.redirect = this.router.url.split('?redirect=')[1] || ''

		this.changeDetectorRef.detectChanges()
	}

	async ngOnInit() {
		this.subscribeFormComplete()
	}

	subscribeFormComplete() {
		this.propertyFormComplete.subscribe(async (formData) => {
			try {
				console.log('Property form complete', formData)

				const property = await this.propertiesService.saveFormData(formData)
				await this.router.navigate([ RouterMap.Watchlist.url([ this.propertyId, RouterMap.Watchlist.MODELING, property.propertyData.id ])])

				try {
					await this.refreshProperty()
				}
				catch (err) {
					this.layoutService.openSnackBar(this.translate.instant('page.watchlist.property-model-overview.errorOverview'), null, 5000, 'error', false)
				}

				if (this.propertyId && this.modalRef) {
					this.modalRef.closeModal()
				}
				this.propertiesService.addingWatchListData.next(false)
				this.spinnerService.hide()
				this.modalRef.closeModal()
			}
			catch (err) {
				console.error(err)
				this.spinnerService.hide()
				this.propertiesService.addingWatchListData.next(false)
			}
		})
	}

	async refreshProperty(): Promise<void> {
		this.propertyId = this.route.snapshot.paramMap.get('modelId')
		this._propertyDoc = this.propertiesService.getByPropertyId(this.propertyId)
		this._propertyDoc$.next(this._propertyDoc)

		if (!this._propertyDoc.hypothesisData) {
			throw 'No hypothesisData found!'
		}
		else if (!this._propertyDoc.propertyData) {
			throw 'No propertyData found!'
		}
	}

	edit(): void {
		const config = new PropertyFormConfig()
		config.init(this._propertyDoc.propertyData, this._propertyDoc.hypothesisData)

		this.modalRef = this.layoutService.openModal(PropertyAddComponent, {
			config,
			complete: this.propertyFormComplete
		}, false)
	}

	async compare(): Promise<boolean> {
		return this.router.navigate([
			RouterMap.Watchlist.url([
				this.propertyId,
				RouterMap.Watchlist.MODELING,
				this._propertyDoc.propertyData.id,
				RouterMap.Watchlist.COMPARE ])
		])
	}

	async delete(): Promise<void> {
		const success = await this.propertiesService.deleteModel(this._propertyDoc.$loki)
		if (success) {
			this.location.back()
		}
	}

	ngOnDestroy() {
		this.subscription = false
	}

	get showBack() {
		return this.redirect.includes(RouterMap.Watchlist.path)
	}

	async back(): Promise<void> {
		if (this.redirect) {
			this.router.navigateByUrl(decodeURIComponent(this.redirect))
		}
		else {
			this.router.navigateByUrl(RouterMap.Watchlist.path)
		}
	}

}
