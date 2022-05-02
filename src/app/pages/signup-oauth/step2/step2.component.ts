import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
	selector: 'app-step2',
	templateUrl: './step2.component.html',
	styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

	@Input() form: FormGroup
	@Input() step: number
	@Input() errMessage: string
	@Output() resendVerification: EventEmitter<boolean> = new EventEmitter();
	
	constructor() { }

	ngOnInit() {

	}

	resendVerificationCode() {
		this.resendVerification.emit()
	}

}
