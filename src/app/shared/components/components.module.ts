import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManagerComponent } from '@shared/components/account-manager/account-manager.component';
import { LottieComponent } from 'ngx-lottie';
import { SmallInformationCardComponent } from '@shared/components/small-information-card/small-information-card.component';
import { MatDivider } from '@angular/material/divider';
import { KanbanComponent } from '@shared/components/kanban/kanban.component';
import {
  CdkDrag,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { CardTenderComponent } from '@shared/components/card-tender/card-tender.component';
import { CardTenderFilterComponent } from './card-tender-filter/card-tender-filter.component';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { NotificationItemsComponent } from './notification-items/notification-items.component';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { FileInputComponent } from './file/file-input/file-input.component';
import { FileReceiveComponent } from './file/file-receive/file-receive.component';

const components = [
  AccountManagerComponent,
  SmallInformationCardComponent,
  KanbanComponent,
  CardTenderComponent,
  CardTenderFilterComponent,
  NotificationItemsComponent,
  FileInputComponent,
  FileReceiveComponent,
];

@NgModule({
  declarations: [components],
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
    MatDateRangePicker,
    MatRipple,
    MatTooltip,
  ],
  exports: [
    components,
    CardTenderComponent,
    CardTenderFilterComponent,
    NotificationItemsComponent,
  ],
})
export class ComponentsModule {}
