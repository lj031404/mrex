import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appActionDrawerClose]'
})
export class ActionDrawerCloseDirective {
  @Output() close = new EventEmitter();

  @HostListener('click', ['$event']) onClick() {
	this.close.emit();
  }
}
