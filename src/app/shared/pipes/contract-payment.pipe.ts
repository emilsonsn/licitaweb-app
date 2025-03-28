import { Pipe, PipeTransform } from '@angular/core';
import { ContractPaymentCondtion } from '@models/contract';

@Pipe({
  name: 'contractPayment',
})
export class ContractPaymentPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case ContractPaymentCondtion.CASH:
        return 'À Vista';
      case ContractPaymentCondtion.INVOICED_SINGLE:
        return 'Fatura Única';
      case ContractPaymentCondtion.INVOICED_PLAN:
        return 'Faturado';
      default:
        return value;
    }
  }
}
