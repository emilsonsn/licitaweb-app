import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement/agreement.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreementRoutingModule { }
