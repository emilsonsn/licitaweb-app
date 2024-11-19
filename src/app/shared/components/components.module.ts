import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountManagerComponent} from "@shared/components/account-manager/account-manager.component";
import {LottieComponent} from "ngx-lottie";
import {
  SmallInformationCardComponent
} from "@shared/components/small-information-card/small-information-card.component";
import {MatDivider} from "@angular/material/divider";
import {KanbanComponent} from "@shared/components/kanban/kanban.component";
import {CdkDrag, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {CardTenderComponent} from "@shared/components/card-tender/card-tender.component";
import { CardTenderFilterComponent } from './card-tender-filter/card-tender-filter.component';
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatOption, MatSelect} from "@angular/material/select";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from "@angular/material/datepicker";

const components: any[] = [
  AccountManagerComponent,
  SmallInformationCardComponent,
  KanbanComponent
]

@NgModule({
  declarations: [
    components,
    CardTenderComponent,
    CardTenderFilterComponent
  ],
  imports: [
    CommonModule,
    LottieComponent,
    MatDivider,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    MatError,
    MatLabel,
    MatFormField,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatEndDate,
    MatStartDate,
    MatDateRangeInput,
    MatDateRangePicker
  ],
  exports: [
    components,
    CardTenderComponent,
    CardTenderFilterComponent
  ]
})
export class ComponentsModule { }
