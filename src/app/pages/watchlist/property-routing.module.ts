import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouterMap } from '@app/core/utils/router-map.util';
import { PropertiesComponent } from '@app/pages/watchlist/properties/properties.component';
import { PropertyOverviewComponent } from '@app/pages/watchlist/property-overview/property-overview.component';
import { PropertyMapComponent } from '@app/pages/watchlist/property-map/property-map.component';
import { PropertyModelsListComponent } from '@app/pages/watchlist/property-models-list/property-models-list.component';
import { PropertyModelOverviewComponent } from '@app/pages/watchlist/property-model-overview/property-model-overview.component';
import { AuthenticationGuard } from '@app/core/authentication/authentication.guard';
import { PropertyCompareComponent } from './property-compare/property-compare.component';
import { PropertyActivityComponent } from './property-activity/property-activity.component';

const routes: Routes = [
	{ path: '', component: PropertiesComponent, canActivate: [AuthenticationGuard] },
	{
		path: ':id',
		canActivate: [AuthenticationGuard],
		data: { key: 'watchlistId' },
		children: [
			{ path: RouterMap.Watchlist.OVERVIEW, component: PropertyOverviewComponent, data: { key: 'model-overview' } },
			{ path: RouterMap.Watchlist.MAP, component: PropertyMapComponent, data: { key: 'property-map' } },
			{
				path: RouterMap.Watchlist.MODELING, children: [
					{ path: '', component: PropertyModelsListComponent, pathMatch: 'full' },
					{ path: RouterMap.Watchlist.MODEL, children: [
						{ path: '', component: PropertyModelOverviewComponent, pathMatch: 'full', data: { key: 'model' } },
						{ path: RouterMap.Watchlist.COMPARE, component: PropertyCompareComponent, data: { key: RouterMap.Watchlist.COMPARE } },
					] },
					{ path: '**', redirectTo: '' }
				]
			},
			{ path: RouterMap.Watchlist.ACTIVITY, component: PropertyActivityComponent, data: { key: 'activity' } },
			{ path: '**', redirectTo: '' }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PropertyRoutingModule { }
