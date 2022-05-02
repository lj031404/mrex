import { Component, HostBinding, Input } from '@angular/core';

import { MenuItem, MenuItemType } from '@app-models/menu.interface';
import { GlobalService } from '@app/core/services/global.service';
import { RouterMap } from '@app/core/utils/router-map.util';

@Component({
	selector: 'app-menu-container',
	templateUrl: './menu-container.component.html',
	styleUrls: ['./menu-container.component.scss']
})
export class MenuContainerComponent {

	@Input() items: MenuItem[];

	@HostBinding('class.app-menu-container') hostClassName = true;
	menuItemType = MenuItemType;

	constructor(private globalService: GlobalService) {
	}

	CloseMenu(item: MenuItem) {
		(window['jQuery'] as any).app.menu.hide()

		// Reset href of footerbar when user clicks subscription menu himself
		if (item.scope === 'subscription') {
			this.globalService.menuClicked$.next({
				key: RouterMap.Market.path,
				href:  RouterMap.Market.url([RouterMap.Market.OVERVIEW, RouterMap.Market.LIST])
			})
		}
		
	}
}
