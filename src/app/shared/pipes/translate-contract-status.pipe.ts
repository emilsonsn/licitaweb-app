import {Pipe, PipeTransform} from '@angular/core';
import {ContractStatusEnum} from "@shared/enums/ContractStatusEnum";

@Pipe({
  name: 'translateContractStatus'
})
export class TranslateContractStatusPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case ContractStatusEnum.ACTIVE:
        return 'Em Vigor';
      case ContractStatusEnum.COMPLETED:
        return 'Finalizado';
      case ContractStatusEnum.CANCELED:
        return 'Cancelado';
      case ContractStatusEnum.AWAITING_SIGNATURE:
        return 'Aguardando Assinatura';
      case ContractStatusEnum.RENEWING:
        return 'Em Renovação';
      default:
        return value;
    }
  }

}
