import {
	ApplicationRef,
	ComponentFactoryResolver,
	EmbeddedViewRef,
	Injectable,
	Injector,
	Type,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router'
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { filter } from 'rxjs/operators'

import { ModalRef } from '@app-models/modal-ref'
import { ModalComponent } from '@app/layout/component/modal/modal.component'
import { TranslateService } from '@ngx-translate/core';
import { CordovaEvent } from '@app-models/cordovaEvent.enum';
import { CordovaEventService } from '@app-services/cordova-event.service';

@Injectable()
export class LayoutService {
	public modalRefList: ModalRef[] = []
	public snackBarRef: MatSnackBarRef<SimpleSnackBar>
	constructor(
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver,
		private applicationRef: ApplicationRef,
		private injector: Injector,
		private snackBar: MatSnackBar,
		private translate: TranslateService,
		private cordovaEventService:CordovaEventService
	) {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe(() => {
			this.closeMenu()
		})

		this.cordovaEventService.cordovaEvent.subscribe((evento: CordovaEvent) => {
			if (evento == CordovaEvent.BackButton) {
				this.closeStackedModals()
			}
		});
	}

	initMenu() {
		(window['jQuery'] as any).app.menu.init();
	}

	closeMenu() {
		(window['jQuery'] as any).app.menu.hide()
	}

	openModal(modalContentComponentType: Type<any>, modalProps?: any, isAddModalRefList = true) {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent)
		const componentRef = componentFactory.create(this.injector)
		this.applicationRef.attachView(componentRef.hostView)

		const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement
		document.body.appendChild(domElement)

		const modalRef = new ModalRef(componentRef)

		componentRef.instance['data'] = {
			component: modalContentComponentType,
			props: modalProps
		}
		componentRef.instance['modalRef'] = modalRef
		componentRef.instance.loadComponent()
		componentRef.instance.show()

		const subscription = modalRef.closed$.subscribe(() => {
			this.closeModal(modalRef)
			subscription.unsubscribe()
		})

		if (isAddModalRefList) {
			this.modalRefList.push(modalRef)
		} else {
			window.history.state.modal = modalRef
		}
		return modalRef
	}

	closeWindowHistoryModal() {
		const ref = window.history.state.modal
		if (ref) {
			this.applicationRef.detachView(ref.hostComponentRef.hostView)
			ref.hostComponentRef.destroy()
		}
		window.history.state.modal = null
		
	}

	closeModal(modalRef: ModalRef) {
		(modalRef.hostComponentRef.instance as ModalComponent).beforeClose()

		setTimeout(() => {
			this.applicationRef.detachView(modalRef.hostComponentRef.hostView)
			modalRef.hostComponentRef.destroy()

			const idx = this.modalRefList.findIndex(ref => ref === modalRef)
			this.modalRefList.splice(idx, 1)
		}, 200)
	}

	closeAllModals() {
		if (this.modalRefList.length) {
			this.modalRefList.forEach(ref => {
				this.applicationRef.detachView(ref.hostComponentRef.hostView)
				ref.hostComponentRef.destroy()
			})
		}

		this.modalRefList = []
	}

	closeStackedModals() {
		if (this.modalRefList.length) {
			const lengthModal = this.modalRefList.length
			const lastModalRef = this.modalRefList[lengthModal-1]
			this.applicationRef.detachView(lastModalRef.hostComponentRef.hostView)
			lastModalRef.hostComponentRef.destroy()
			this.modalRefList.splice(lengthModal-1, 1)
		}
	}

	openSnackBar(message: string, action: string = null, duration: number = 3000, type: string, noMarginBottom: boolean = true) {
		let panelClass
		switch (type) {
			case 'error':
				panelClass = 'msg-error'
				break;
			case 'info':
				panelClass = 'msg-info'
				break;
			case 'warning':
				panelClass = 'msg-warning'
			default:
				break
		}
		panelClass += noMarginBottom ? '-no-margin' : ''

		this.snackBarRef = this.snackBar.open(this.translate.instant(message), action, {
			duration,
			panelClass
		})
	}
}
