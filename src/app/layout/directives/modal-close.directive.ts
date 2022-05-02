import { Directive, HostListener, Input } from '@angular/core'
import { ModalRef } from '@app-models/modal-ref'

@Directive({
	selector: '[appModalClose]'
})
export class ModalCloseDirective {
	@Input() modalRef: ModalRef

	constructor() { }

	@HostListener('click') onClick() {
		this.modalRef.closeModal()
	}

}
