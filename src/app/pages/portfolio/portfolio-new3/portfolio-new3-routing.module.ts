import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioNew3Component } from './portfolio-new3.component';



const routes: Routes = [
  {
    path: '',
    component: PortfolioNew3Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioNew3RoutingModule { }
