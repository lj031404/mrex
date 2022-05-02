import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouterMap } from '@app/core/utils/router-map.util';
import { PortfolioOutletComponent } from '@app/pages/portfolio/portfolio-outlet/portfolio-outlet.component';
import { PortfolioSummaryComponent } from '@app/pages/portfolio/portfolio-summary/portfolio-summary.component';
import { PortfolioPropertiesComponent } from '@app/pages/portfolio/portfolio-properties/portfolio-properties.component';
import { PortfolioPropertyComponent } from '@app/pages/portfolio/portfolio-property/portfolio-property.component';

const routes: Routes = [
	{
		path: '', component: PortfolioOutletComponent, children: [
			{ path: '', redirectTo: RouterMap.Portfolio.SUMMARY, pathMatch: 'full', data: { key: 'summary'} },
			{ path: RouterMap.Portfolio.SUMMARY, component: PortfolioSummaryComponent, data: { key: 'summary'} },
			{ path: `${RouterMap.Portfolio.PROPERTIES}/:id`, component: PortfolioPropertiesComponent, pathMatch: 'full' },
		]
	},
	{ path:  RouterMap.Portfolio.NEW, loadChildren: './portfolio-new/portfolio-new.module#PortfolioNewModule', pathMatch: 'full' },
	{ path:  RouterMap.Portfolio.EDIT_PORTFOLIO, loadChildren: './portfolio-new/portfolio-new.module#PortfolioNewModule', pathMatch: 'full' },
	{ path:  RouterMap.Portfolio.UPDATE_PORTFOLIO, loadChildren: './portfolio-new/portfolio-new.module#PortfolioNewModule', pathMatch: 'full' },
	{ path: RouterMap.Portfolio.PROPERTY, component: PortfolioPropertyComponent },
	{ path: '**', redirectTo: RouterMap.Portfolio.SUMMARY }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PortfolioRoutingModule { }
