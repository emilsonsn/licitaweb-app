import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticesRoutingModule } from './notices-routing.module';
import { NoticesComponent } from './notices/notices.component';
import { ComponentsModule } from "../../../shared/components/components.module";
import { TablesModule } from "../../../shared/tables/tables.module";
import { ModalityComponent } from './modality/modality.component';


@NgModule({
  declarations: [
    NoticesComponent,
    ModalityComponent
  ],
  imports: [
    CommonModule,
    NoticesRoutingModule,
    ComponentsModule,
    TablesModule
]
})
export class NoticesModule { }
