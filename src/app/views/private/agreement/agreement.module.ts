import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgreementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement/agreement.component';

import {TablesModule} from '@shared/tables/tables.module';
import {ComponentsModule} from "@shared/components/components.module";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatRipple} from "@angular/material/core";
import {FullCalendarModule} from "@fullcalendar/angular";
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatPaginator} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AgreementComponent,
  ],
  imports: [
    CommonModule,
    AgreementRoutingModule,
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
export class AgreementModule { }
