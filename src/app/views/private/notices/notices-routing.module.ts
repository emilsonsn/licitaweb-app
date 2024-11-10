import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticesComponent } from './notices/notices.component';
import { ModalityComponent } from './modality/modality.component';

const routes: Routes = [
  {
    path: '',
    component: NoticesComponent, // Carrega o componente Notices por padrão
  },
  {
    path: 'modality',
    component: ModalityComponent, // Carrega o componente Modalidade
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticesRoutingModule { }
