import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouterMap } from '@app/core/utils/router-map.util';

import { MarketOverviewComponent } from '@app/pages/market/market-overview/market-overview.component';
import { MarketListComponent } from '@app/pages/market/market-list/market-list.component';
import { MarketListingComponent } from './market-listing/market-listing.component';
import { SalesComparisonComponent } from './sales-comparison/sales-comparison.component';
import { MarketSavedComponent } from './market-saved/market-saved.component';
import { AdvancedSalesComparisonComponent } from './advanced-sales-comparison/advanced-sales-comparison.component';
import { NotesComponent } from './components/notes/notes.component'
import { MarketMapComponent } from './market-map/market-map.component';

const routes: Routes = [
	{ path: '', redirectTo: RouterMap.Market.OVERVIEW, pathMatch: 'full' },
	{
		path: RouterMap.Market.OVERVIEW, component: MarketOverviewComponent, children: [
			{ path: '', redirectTo: RouterMap.Market.MAP, pathMatch: 'full' },
			{ path: RouterMap.Market.MAP, component: MarketMapComponent, data: { key: RouterMap.Market.MAP } },
			{ path: RouterMap.Market.LIST, component: MarketListComponent, data: { key: RouterMap.Market.LIST } },
			{ path: RouterMap.Market.SAVED, component: MarketSavedComponent, data: { key: RouterMap.Market.SAVED } },
		]
	},
	{ path: RouterMap.Market.PROPERTY, component: MarketListingComponent, pathMatch: 'full', data: { key: RouterMap.Market.PROPERTY } },
	{ path: RouterMap.Market.NOTE, component: NotesComponent, pathMatch: 'full' },
	{ path: RouterMap.Market.SALES_COMPARISON, component: SalesComparisonComponent, pathMatch: 'full', data: { key: RouterMap.Market.SALES_COMPARISON } },
	{ path: RouterMap.Market.ADVANCED_SALES_COMPARISON, component: AdvancedSalesComparisonComponent, pathMatch: 'full', data: { key: RouterMap.Market.ADVANCED_SALES_COMPARISON } },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MarketRoutingModule { }
