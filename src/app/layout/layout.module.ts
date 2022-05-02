import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material';

import { UserProfileModule } from '@app/shared/components/user-profile/user-profile.module';

import { LayoutService } from './service/layout.service';
import { ActionDrawerComponent } from './component/action-drawer/action-drawer.component';
import { ContentComponent } from './component/content/content.component';
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { MenuComponent } from './component/menu/menu.component';
import { ModalComponent } from './component/modal/modal.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { MenuHeaderComponent } from './component/menu/menu-header.component';
import { MenuContainerComponent } from './component/menu/menu-container.component';
import { ActionDrawerOutletComponent } from './component/action-drawer-outlet/action-drawer-outlet.component';
import { ActionDrawerCloseDirective } from './directives/action-drawer-close.directive';
import { ModalContentDirective } from './directives/modal-content.directive';
import { ModalCloseDirective } from './directives/modal-close.directive';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionRequireDirective } from './directives/subscription-require.directive';
import { LockedDirective } from './directives/locked.directive';
import { FooterNavigateComponent } from './component/footer-navigate/footer-navigate.component';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
	declarations: [
		ActionDrawerComponent, ContentComponent, FooterComponent, HeaderComponent, MenuComponent, ModalComponent,
		ToolbarComponent, MenuHeaderComponent, MenuContainerComponent,
		ActionDrawerOutletComponent, ActionDrawerCloseDirective, ModalContentDirective, ModalCloseDirective, SubscriptionRequireDirective,
		LockedDirective,
		FooterNavigateComponent
	],
	providers: [
		LayoutService,
	],
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule,
		MatSnackBarModule,
		TranslateModule,
		UserProfileModule,
		ButtonsModule,
		SharedModule
	],
	exports: [
		ActionDrawerComponent,
		ActionDrawerOutletComponent,
		ActionDrawerCloseDirective,
		ContentComponent,
		FooterComponent,
		HeaderComponent,
		MenuComponent,
		MenuHeaderComponent,
		MenuContainerComponent,
		ModalComponent,
		ModalCloseDirective,
		ToolbarComponent,
		SubscriptionRequireDirective,
		LockedDirective,
		FooterNavigateComponent
	],
	entryComponents: [
		ModalComponent
	]
})
export class LayoutModule {
	static forRoot() {
		return {
			ngModule: LayoutModule,
			providers: []
		};
	}
}
