import { Pipe, PipeTransform } from '@angular/core';
import { StatusLicitaWeb } from '@models/statusLicitaWeb';

@Pipe({
  name: 'statusLicitaWeb'
})
export class StatusLicitaWebPipe implements PipeTransform {
  private statusTranslations: { [key in StatusLicitaWeb]: string } = {
    [StatusLicitaWeb.Canceled]: 'Cancelado',
    [StatusLicitaWeb.Contract]: 'Contrato',
    [StatusLicitaWeb.Quoted]: 'Cotado',
    [StatusLicitaWeb.Pending]: 'Em Aberto',
    [StatusLicitaWeb.InQuotation]: 'Em Cotação',
    [StatusLicitaWeb.Challenged]: 'Impugnado',
    [StatusLicitaWeb.ProposalSent]: 'Proposta Enviada',
    [StatusLicitaWeb.Extended]: 'Prorrogado',
    [StatusLicitaWeb.Open]: 'Aberto',
  };

  transform(value: StatusLicitaWeb): string {
    return this.statusTranslations[value] || value;
  }

}
