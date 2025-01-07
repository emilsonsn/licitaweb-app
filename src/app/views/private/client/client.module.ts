import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';


@NgModule({
  declarations: [
    ClientComponent
  ],
  imports: [
      CommonModule,
      ClientRoutingModule,
      SharedModule,
      MatDialogModule,
      MatButtonModule,
      MatRipple,
      MatDivider
  ]
})
export class ClientModule { }
