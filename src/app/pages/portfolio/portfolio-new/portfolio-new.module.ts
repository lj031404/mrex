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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module'

import { PortfolioNewRoutingModule } from './portfolio-new-routing.module';
import { PortfolioNewComponent } from './portfolio-new.component';
import { FormFieldModule } from '@app/shared/components/form-field/form-field.module'


@NgModule({
  declarations: [PortfolioNewComponent],
  imports: [
    CommonModule,
    PortfolioNewRoutingModule,
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
    ReactiveFormsModule
  ]
})
export class PortfolioNewModule { }
