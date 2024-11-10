import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenderRoutingModule } from './tender-routing.module';
import { TenderComponent } from './tender/tender.component';
import { ModalityComponent } from './modality/modality.component';
import { StageComponent } from './stage/stage.component';
import { TablesModule } from '@shared/tables/tables.module';
import { ComponentsModule } from "../../../shared/components/components.module";


@NgModule({
  declarations: [
    TenderComponent,
    ModalityComponent,
    StageComponent,
  ],
  imports: [
    CommonModule,
    TenderRoutingModule,
    TablesModule,
    ComponentsModule
]
})
export class TenderModule { }
