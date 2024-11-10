import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PrivateRoutingModule} from './private-routing.module';
import {HomeModule} from "@app/views/private/home/home.module";
import {MAT_DATE_FORMATS} from "@angular/material/core";

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    HomeModule,
  ],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
})
export class PrivateModule {
}
