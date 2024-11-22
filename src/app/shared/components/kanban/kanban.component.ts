import {Component, EventEmitter, HostListener, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Kanban} from "@models/Kanban";
import {Task, TaskStatus} from "@models/Task";


@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent {
  protected readonly Object = Object;
  @Input() data: Kanban<Task> = {};
  @ViewChildren(CdkDropList) dropLists: QueryList<CdkDropList>;
  @Output() taskMoved: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskClicked: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() crateColumn: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() editColumnStatus: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteColumnStatus: EventEmitter<string> = new EventEmitter<string>();
  @Input() status!: TaskStatus[];

  drop(event: CdkDragDrop<Task[]>) {
    const currentContainerIndex = this.getContainerIndex(event.container);

    const movedItem = event.item.data; // O item movimentado

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    /*    console.log('Item movido:', movedItem); // Para depuração, imprime o item
        console.log('De:', event.previousContainer.id); // Container de origem
        console.log('Para:', event.container.id); // Container de destino*/

    this.changeColumn(currentContainerIndex, event, movedItem);
  }


  private changeColumn(currentContainerIndex: number, event: CdkDragDrop<Task[]>, task?: Task) {
    const keys: (string | number)[] = Object.keys(this.data) as (keyof Kanban<Task>)[];
    const status = this.status.find(status => status.name === keys[currentContainerIndex]);

    task.task_status_id = status.id;

    this.taskMoved.emit(task);
  }

  private getContainerIndex(container: CdkDropList): number {
    return this.dropLists.toArray().indexOf(container);
  }

  getBorderColor(task_status_id: number) {
    return this.status.find(s => s.id === task_status_id).color;
  }

  onBoxClick(item: Task) {
    this.taskClicked.emit(item);
  }

  @HostListener("click", ["$event"])
  public deleteTask(event: Event, task: Task): void {
    event.stopPropagation();
    this.taskDeleted.emit(task);
  }

  addColumn(event: Event) {
    event.stopPropagation();
    this.crateColumn.emit(event);
  }

  editColumn($event: MouseEvent, key: string) {
    $event.stopPropagation();
    this.editColumnStatus.emit(key);
  }

  deleteColumn($event: MouseEvent, key: string) {
    $event.stopPropagation();
    this.deleteColumnStatus.emit(key);
  }

  stringfy(item){
    return JSON.stringify(item);
  }
}
