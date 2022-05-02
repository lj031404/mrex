import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-menu-header',
  template: '<ng-content></ng-content>'
})
export class MenuHeaderComponent {
  @HostBinding('class.app-menu-header') hostClassName = true;
}
