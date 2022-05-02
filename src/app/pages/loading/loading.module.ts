import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '@app/shared/components/loader/loader.module';

import { LoadingRoutingModule } from './loading-routing.module';
import { LoadingComponent } from './loading.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LoadingComponent],
	imports: [
		CommonModule,
		LoadingRoutingModule,
		LoaderModule,
		TranslateModule
	]
})
export class LoadingModule { }
