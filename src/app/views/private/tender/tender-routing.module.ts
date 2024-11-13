import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenderComponent } from './tender/tender.component';
import { ModalityComponent } from './modality/modality.component';
import { StageComponent } from './stage/stage.component';
import {TenderTaskComponent} from "@app/views/private/tender/tender-task/tender-task.component";

const routes: Routes = [
  {
    path: '',
    component: TenderComponent
  },
  {
    path: 'modality',
    component: ModalityComponent
  },
  {
    path: 'stage',
    component: StageComponent
  },
  {
    path: 'task',
    component: TenderTaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenderRoutingModule { }
