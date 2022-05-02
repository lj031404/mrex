import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core/authentication/authentication.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
	defaultBackgroundImgSrc = 'assets/images/menu/left-menu-bg.jpg';

	constructor(public authenticationService: AuthenticationService) {}
}
