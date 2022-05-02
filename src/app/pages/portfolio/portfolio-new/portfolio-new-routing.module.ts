import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioNewComponent } from './portfolio-new.component';


const routes: Routes = [
  {
    path: '',
    component: PortfolioNewComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioNewRoutingModule { }
