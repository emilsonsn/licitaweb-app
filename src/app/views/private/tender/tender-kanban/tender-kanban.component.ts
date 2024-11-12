import {Component} from '@angular/core';
import {Kanban} from "@models/Kanban";
import {Task, TaskStatus} from "@models/Task";
import {User} from "@models/user";

@Component({
  selector: 'app-tender-kanban',
  templateUrl: './tender-kanban.component.html',
  styleUrl: './tender-kanban.component.scss'
})
export class TenderKanbanComponent {
  data: Kanban<Task> = {}
  users: User[] = [];
  status: TaskStatus[] = []

  taskMoved($event: Task) {

  }

  openDialogTask($event: Task) {

  }

  deleteTask($event: Task) {

  }
}
