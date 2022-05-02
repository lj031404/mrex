import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SignUpError } from '@app-core/models/signup-err.interface';

@Component({
  selector: 'app-forgot-step3',
  templateUrl: './forgot-step3.component.html',
  styleUrls: ['./forgot-step3.component.scss']
})
export class ForgotStep3Component implements OnInit {

  @Input() form: FormGroup
  @Input() step: number
  @Input() error_messages: SignUpError
  @Input() errResetPassword: string
  passMoved: Boolean = false
  confirmPassMoved: Boolean = false
  passwordType: string = 'password'
  conformPasswordType: string = 'password'

  constructor() { }

  ngOnInit() {
    this.form.patchValue({
      password: null,
      confirmPassword: null
    })
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password')
    const { value: confirmPassword } = formGroup.get('confirmPassword')
    return password === confirmPassword
  }

  passwordMoved(status) {
	  this.passMoved = status
  }

  confirmMoved(status) {
	  this.confirmPassMoved = status
  }

  passwordShow(type: string) {
		this.passwordType = type
	}
  
  conformPasswordShow(type: string) {
		this.conformPasswordType = type
	}
}
