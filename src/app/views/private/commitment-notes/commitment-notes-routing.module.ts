import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CommitmentNotesComponent
} from "@app/views/private/commitment-notes/commitment-notes/commitment-notes.component";

const routes: Routes = [
  {
    path: '',
    component: CommitmentNotesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitmentNotesRoutingModule { }
