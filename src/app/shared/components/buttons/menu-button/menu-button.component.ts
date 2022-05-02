import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-menu-button',
  template: `
    <div class="nav-link nav-menu-main menu-toggle hidden-xs" [class.p-0]="imgSrc">
      <div [class.icon-content]="!imgSrc">
        <img [src]="imgSrc ? imgSrc : 'assets/icons/hamburgermenu.svg'" [class.user-img]="imgSrc" />
      </div>
      <div class="menu-title" *ngIf="!imgSrc">Menu</div>
    </div>
  `,
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent {
  @Input() imgSrc? = ''
  @HostBinding('class.app-menu-button') hostClassName = true;
}
