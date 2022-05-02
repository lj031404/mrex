import { Component, Input } from '@angular/core'

import { ModalRef } from '@app-models/modal-ref'

@Component({
	selector: 'app-term-of-use',
	templateUrl: './term-of-use.component.html',
	styleUrls: ['./term-of-use.component.scss']
})
export class TermOfUseComponent {
	@Input() modalRef: ModalRef
}
