import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AgmCoreModule } from '@agm/core';
import { AgmMapComponent } from './agm-map.component';

@NgModule({
  declarations: [AgmMapComponent],
  imports: [
	CommonModule,
	TranslateModule,
	AgmCoreModule
  ],
  exports: [AgmMapComponent]
})
export class AgmMapModule { }
