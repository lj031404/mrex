import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordForgotComponent } from './password-forgot.component';

const routes: Routes = [
	{ path: '', component: PasswordForgotComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PasswordForgotRolutingModule { }
