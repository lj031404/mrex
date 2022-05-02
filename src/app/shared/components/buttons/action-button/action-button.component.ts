import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {
  @HostBinding('class.app-action-button') hostClassName = true;

  @Input() top: string | null;
  @Input() bottom: string | null;
  @Input() left: string | null;
  @Input() right: string | null;
  @Input() borderRadius = '50%';

  @Output() triggered = new EventEmitter();

  private isActive = true;
  get active(): boolean {
	return this.isActive;
  }
  set active(value: boolean) {
	this.isActive = value;
  }

  constructor() { }

  ngOnInit() {
  }

}
