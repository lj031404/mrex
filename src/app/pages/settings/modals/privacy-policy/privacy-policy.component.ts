import { Component, Input } from '@angular/core'

import { ModalRef } from '@app-models/modal-ref'

@Component({
	selector: 'app-privacy-policy',
	templateUrl: './privacy-policy.component.html',
	styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
	@Input() modalRef: ModalRef
}
