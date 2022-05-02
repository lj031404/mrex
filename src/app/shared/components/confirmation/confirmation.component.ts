import { Component, Input, OnInit } from '@angular/core';

import { ModalRef } from '@app-models/modal-ref';

@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
	@Input() modalRef: ModalRef
	@Input() icon: string
	@Input() imgUrl?: string
	@Input() mainTitle?: string
	@Input() title: string
	@Input() text: string
	@Input() backAction: any
	@Input() backBtnText?: string
	@Input() onConfirmClick?: Function
	@Input() reActionText?: string
	constructor(
	) { }

	ngOnInit() {
	}

	onBackClick() {
		if (this.backAction) {
			this.backAction()
			return
		}

		this.modalRef.closeModal()

		if (this.onConfirmClick) {
			this.onConfirmClick()
		}

	}

	onReActionClick() {
		this.modalRef.closeModal('reaction')
	}
}
