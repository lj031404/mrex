import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {

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
