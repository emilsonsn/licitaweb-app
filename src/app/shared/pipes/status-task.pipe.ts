import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatusEnum } from '@models/Task';
import { TenderTaskStatusEnum } from '@models/tenderTaks';

@Pipe({
  name: 'task_status'
})
export class StatusTaskPipe implements PipeTransform {
  transform(value: string | TenderTaskStatusEnum) {
    switch (value) {
      case TenderTaskStatusEnum.Pending:
        return 'Pendente';
      case TenderTaskStatusEnum.InProgress:
        return 'Em andamento';
      case TenderTaskStatusEnum.Completed:
        return 'Finalziada';
      default:
        return value;
    }
  }
}
