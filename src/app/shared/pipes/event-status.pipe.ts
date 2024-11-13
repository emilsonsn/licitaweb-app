import {Pipe, PipeTransform} from '@angular/core';
import {EventStatus} from "@models/Event";

@Pipe({
  name: 'eventStatus'
})
export class EventStatusPipe implements PipeTransform {

  transform(value: EventStatus): string {
    switch (value) {
      case EventStatus.Pending:
        return 'Pendente';
      case EventStatus.InProgress:
        return 'Em andamento';
      case EventStatus.Completed:
        return 'Concluído';
      default:
        return value;
    }
  }

}
