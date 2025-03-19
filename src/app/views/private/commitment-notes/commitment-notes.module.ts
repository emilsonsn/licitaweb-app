import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitmentNotesRoutingModule } from './commitment-notes-routing.module';
import { CommitmentNotesComponent } from './commitment-notes/commitment-notes.component';
import {ComponentsModule} from "@shared/components/components.module";
import {MatRipple} from "@angular/material/core";
import {TablesModule} from "@shared/tables/tables.module";


@NgModule({
  declarations: [
    CommitmentNotesComponent
  ],
  imports: [
    CommonModule,
    CommitmentNotesRoutingModule,
    ComponentsModule,
    MatRipple,
    TablesModule
  ]
})
export class CommitmentNotesModule { }
