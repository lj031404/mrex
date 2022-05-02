import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-item',
  template: '<ng-content></ng-content>',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @HostBinding('class.app-item') hostClassName = true;
}
