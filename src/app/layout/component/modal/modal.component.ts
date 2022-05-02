import {
	Component,
	ComponentFactoryResolver,
	HostBinding,
	Input,
	OnDestroy,
	OnInit,
	Type,
	ViewChild
} from '@angular/core';

import { ModalRef } from '@app-models/modal-ref'
import { ModalContentDirective } from '@app/layout/directives/modal-content.directive'
import { modalFade, modalSlide } from '@app-animations/modal-animation'

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
	animations: [modalFade, modalSlide]
})
export class ModalComponent implements OnInit, OnDestroy {
	@ViewChild(ModalContentDirective, {static: true}) modalContentDirective: ModalContentDirective

	@Input() data: {
		component: Type<any>
		props?: any
	}
	@Input() modalRef: ModalRef

	@HostBinding('class.app-modal') hostClassName = true

	isActive = false
	modalState: 'initiated' | 'opened' | 'closing' = 'initiated'

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver
	) {}

	ngOnInit() {
	}

	beforeClose(): void {
		this.modalState = 'closing'

		if (window.history.state.modal) {
			history.back();
		}
		
		setTimeout(() => {
			this.isActive = false
		}, 180)
	}

	ngOnDestroy() {
		if (window.history.state.modal) {
			history.back();
		}
	}

	show() {
		history.pushState({
			modal: true
		}, null)
		this.isActive = true
		this.modalState = 'opened'
	}

	loadComponent() {
		if (!this.data || !this.data.component) {
			return
		}

		const viewContainerRef = this.modalContentDirective.viewContainerRef
		viewContainerRef.clear()

		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.data.component)
		const componentRef = viewContainerRef.createComponent(componentFactory)

		if (this.modalRef) {
			(componentRef.instance as { modalRef: ModalRef }).modalRef = this.modalRef
		}

		if (this.data.props) {
			Object.keys(this.data.props).forEach(key => {
				componentRef.instance[key] = this.data.props[key]
			})
		}
	}
}
