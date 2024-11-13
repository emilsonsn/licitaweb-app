import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ComponentsModule } from '@shared/components/components.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { FiltersModule } from './filters/filters.module';
import { DialogCollaboratorComponent } from './dialog-collaborator/dialog-collaborator.component';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { DialogProviderComponent } from './dialog-provider/dialog-provider.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DialogServiceComponent } from './dialog-service/dialog-service.component';
import { DialogConstructionComponent } from './dialog-construction/dialog-construction.component';
import { DialogClientComponent } from './dialog-client/dialog-client.component';
import { DialogTypeProviderComponent } from './dialog-type-provider/dialog-type-provider.component';
import { TablesModule } from '@shared/tables/tables.module';
import { DialogTypeServiceComponent } from './dialog-type-service/dialog-type-service.component';
import { DialogTypeUserSectorComponent } from './dialog-type-user-sector/dialog-type-user-sector.component';
import { MatIcon } from "@angular/material/icon";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DialogNoticesComponent } from './dialog-notices/dialog-notices.component';
import { DialogModalityComponent } from './dialog-modality/dialog-modality.component';
import { ColorChromeModule } from "ngx-color/chrome";

import localePt from '@angular/common/locales/pt';
import { CustomDateAdapter } from '@app/app.module';
import { DialogStepComponent } from './dialog-step/dialog-step.component';


registerLocaleData(localePt, 'pt-BR');

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
  declarations: [
    DialogConfirmComponent,
    DialogCollaboratorComponent,
    DialogProviderComponent,
    DialogServiceComponent,
    DialogConstructionComponent,
    DialogClientComponent,
    DialogTypeProviderComponent,
    DialogTypeServiceComponent,
    DialogTypeUserSectorComponent,
    DialogStepComponent,
    DialogNoticesComponent,
    DialogModalityComponent,
  ],
  imports: [
    CommonModule,
    FiltersModule,
    TablesModule,
    ComponentsModule,
    DirectivesModule,
    ClipboardModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatRippleModule,
    TextFieldModule,
    CdkTextareaAutosize,
    CurrencyMaskModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxMatSelectSearchModule,
    MatIcon,
    ColorChromeModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR'
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ]
})
export class DialogsModule {
}
