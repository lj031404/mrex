import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-menu',
  template: `
    <div class="main-menu material-menu menu-fixed menu-light menu-accordion menu-shadow" data-scroll-to-active="true">
      <ng-content></ng-content>
    </div>
  `
})
export class MenuComponent {
  @HostBinding('class.app-menu') hostClassName = true;
}
