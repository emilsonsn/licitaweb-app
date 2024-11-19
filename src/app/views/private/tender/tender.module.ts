import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TenderRoutingModule} from './tender-routing.module';
import {TenderComponent} from './tender/tender.component';
import {ModalityComponent} from './modality/modality.component';
import {StageComponent} from './stage/stage.component';
import {TablesModule} from '@shared/tables/tables.module';
import {ComponentsModule} from "@shared/components/components.module";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatRipple} from "@angular/material/core";
import {TenderKanbanComponent} from './tender-kanban/tender-kanban.component';
import {TenderTaskComponent} from './tender-task/tender-task.component';
import {FullCalendarModule} from "@fullcalendar/angular";
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchComponent } from './search/search.component';
import {MatPaginator} from "@angular/material/paginator";


@NgModule({
  declarations: [
    TenderComponent,
    ModalityComponent,
    StageComponent,
    TenderKanbanComponent,
    TenderTaskComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    TenderRoutingModule,
    TablesModule,
    ComponentsModule,
    MatTab,
    MatTabGroup,
    MatRipple,
    FullCalendarModule,
    MatTooltipModule,
    MatPaginator
  ]
})
export class TenderModule {
}
