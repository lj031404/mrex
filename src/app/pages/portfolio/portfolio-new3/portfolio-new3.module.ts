import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

import { LayoutModule } from '@app/layout/layout.module'
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module'
import { CardModule } from '@app/shared/components/card/card.module'
import { ItemModule } from '@app/shared/components/item/item.module'
import { PipesModule } from '@app/shared/pipes/pipes.module'
import { HelperModule } from '@app/helper/helper.module'

import { MatSelectModule } from '@angular/material'
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module'
import { FormFieldModule } from '@app/shared/components/form-field/form-field.module'
import { StepperModule } from '@app/shared/components/stepper/stepper.module';

import { PortfolioNew3RoutingModule } from './portfolio-new3-routing.module';
import { PortfolioNew3Component } from './portfolio-new3.component';


@NgModule({
  declarations: [PortfolioNew3Component],
  imports: [
    CommonModule,
    PortfolioNew3RoutingModule,
    TranslateModule,
    LayoutModule,
    ButtonsModule,
    CardModule,
    ItemModule,
    PipesModule,
    HelperModule,
    MatSelectModule,
    FormsModule,
    SharedModule,
    FormFieldModule,
    ReactiveFormsModule,
    StepperModule,
    MatRadioModule
  ]
})
export class PortfolioNew3Module { }
