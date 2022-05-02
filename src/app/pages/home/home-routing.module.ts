import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouterMap } from '@app/core/utils/router-map.util';
import { HomeComponent } from './home/home.component';
import { AuthenticationGuard } from '@app/core/authentication/authentication.guard';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{ path: '', component: HomeComponent }
		]
	},
	{ path: '**', redirectTo: RouterMap.Home.HOME }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HomeRoutingModule { }
