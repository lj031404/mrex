import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [UserProfileComponent],
  exports: [
	UserProfileComponent
  ],
	imports: [
		CommonModule,
		SharedModule
	]
})
export class UserProfileModule { }
