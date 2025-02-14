import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '@shared/shared.module';
import {MatRipple} from "@angular/material/core";
import {MatTooltip} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    MatRipple,
    MatTooltip
  ]
})
export class ProductModule { }
