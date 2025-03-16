import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestOrderTypePipe } from './request-order-type.pipe';
import { PaymentFormPipe } from './payment-form.pipe';
import { StatusPipe } from './status.pipe';
import { OrderResponsiblePipe } from './order-responsible.pipe';
import { PhoneMaskPipe } from './phone-mask.pipe';
import { CpfCnpjMaskPipe } from './cpf-cnpj-mask.pipe';
import { SolicitationStatusPipe } from './solicitation-status.pipe';
import { CompanyPositionPipe } from './company-position.pipe';
import { StatusLicitaWebPipe } from './status-licita-web.pipe';
import { StatusTaskPipe } from './status-task.pipe';
import { EventStatusPipe } from './event-status.pipe';
import { DatetimePipe } from './datetime.pipe';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { TranslateContractStatusPipe } from './translate-contract-status.pipe';
import { JsonPathPipe } from './json-path.pipe';

const pipes = [
  RequestOrderTypePipe,
  PaymentFormPipe,
  StatusPipe,
  OrderResponsiblePipe,
  PhoneMaskPipe,
  CpfCnpjMaskPipe,
  SolicitationStatusPipe,
  CompanyPositionPipe,
  StatusLicitaWebPipe,
  StatusTaskPipe,
  DatetimePipe,
  CurrencyFormatPipe
];

@NgModule({
  declarations: [
    pipes,
    CompanyPositionPipe,
    EventStatusPipe,
    DatetimePipe,
    CurrencyFormatPipe,
    TranslateContractStatusPipe,
    JsonPathPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    pipes,
    EventStatusPipe,
    TranslateContractStatusPipe,
    JsonPathPipe
  ]
})
export class PipesModule { }
