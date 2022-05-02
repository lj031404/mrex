import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-group-options',
  templateUrl: './group-options.component.html',
  styleUrls: ['./group-options.component.scss']
})
export class GroupOptionsComponent implements OnInit {
  @Input() title?: string = ''
  @Input() options: Array<{
    title: string,
    value: any
  }> = []
  @Input() control: FormControl

  @HostBinding('class.disabled') classHostDisabled = true

	@HostBinding('class.form-field') classHostName = true
	@HostBinding('class.ng-blank')
	get blank() {
		return this.control && !this.control.value
	}
	@HostBinding('class.ng-touched')
	get ngTouched() {
		return this.control && this.control.touched
	}

	@HostBinding('class.ng-untouched')
	get ngUntouched() {
		return this.control && this.control.untouched
	}

	@HostBinding('class.ng-pristine')
	get ngPristine() {
		return this.control && this.control.pristine
	}

	@HostBinding('class.ng-dirty')
	get ngDirty() {
		return this.control && this.control.dirty
	}

	@HostBinding('class.ng-valid')
	get ngValid() {
		return this.control && this.control.valid
	}

	@HostBinding('class.ng-invalid')
	get ngInvalid() {
		return this.control && this.control.invalid 
	}

	@HostBinding('class.ng-pending')
	get ngPending() {
		return this.control && this.control.pending
	}
  constructor() { }

  ngOnInit() {
  }

  valueChange(option) {
    this.control.setValue(option.value)
  }

}
