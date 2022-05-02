import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PropertiesService } from '@app/core/localDB/properties.service';
import { takeWhile } from 'rxjs/operators';
import { PropertyLocalData, Property } from '@app/core/models/property.interface';
import { ModalRef } from '@app/core/models/modal-ref';
import { LayoutService } from '@app/layout/service/layout.service';
import { _translate } from '@app/core/utils/translate.util';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-properties-select',
	templateUrl: './properties-select.component.html',
	styleUrls: ['./properties-select.component.scss']
})
export class PropertiesSelectComponent implements OnInit, OnDestroy {

	@Input() modalRef: ModalRef
	@Input() modelsOnly = false
	@Input() data: any
	@Input() slot: number
	@Input() propertyDoc: PropertyLocalData
	@Input() subtitle: string
	@Output() complete: EventEmitter<any>

	subscription = true
	propertiesLoaded = false
	properties: PropertyLocalData[] = []
	modalRef2: ModalRef

	constructor(private propertiesService: PropertiesService,
		private translate: TranslateService,
		private layoutService: LayoutService) { }

	ngOnInit() {

		this.properties = this.propertiesService.listProperties()

		// show base models only
		if (this.modelsOnly) {
			const propertyId = this.propertyDoc.propertyData.id
			const properties = this.propertiesService.listChildModels(propertyId)
			this.properties = [ this.propertyDoc, ...properties ]
			this.properties = this.properties.sort((a, b) => new Date(a.propertyData.createdAt).getTime() - new Date(b.propertyData.createdAt).getTime())
		}
		this.propertiesLoaded = true

		this.complete
			.subscribe(_ => {
				if (this.modalRef2) {
					this.modalRef2.closeModal()
				}
			})

	}

	chooseProperty(propertyDoc: PropertyLocalData) {

		// 2nd page with models only
		if (this.modelsOnly) {
			this.complete.emit({ slot: this.slot, propertyDoc })
		}

		// base models only
		else {
			propertyDoc.propertyData.name += _translate(this.translate.instant('page.watchlist.components.properties-select.nameSuffix'))
			this.modalRef2 = this.layoutService.openModal(PropertiesSelectComponent, {
				slot: this.slot,
				complete: this.complete,
				propertyDoc,
				modelsOnly: true,
				subtitle: _translate(this.translate.instant('page.watchlist.components.properties-select.subTitle'))
			})
		}

	}

	ngOnDestroy() {
		this.subscription = false
	}

}
