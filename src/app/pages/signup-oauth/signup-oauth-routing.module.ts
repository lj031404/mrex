import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupOauthComponent } from './signup-oauth.component';

const routes: Routes = [
	{ path: '', component: SignupOauthComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SignupOauthRoutingModule { }
