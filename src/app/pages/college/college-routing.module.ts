import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouterMap } from '@app/core/utils/router-map.util';
import { AuthenticationGuard } from '@app/core/authentication/authentication.guard';
import { CollegeComponent } from './college/college.component';

const routes: Routes = [
	{
		path: '',
		canActivate: [AuthenticationGuard],
		component: CollegeComponent,
		children: [
			{ path: '', redirectTo: RouterMap.College.HOME, pathMatch: 'full' },
			{ path: RouterMap.College.HOME, component: CollegeComponent }
		]
	},
	{ path: '**', redirectTo: RouterMap.College.HOME }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CollegeRoutingModule { }
