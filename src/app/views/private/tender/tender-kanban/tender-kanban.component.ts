import {ChangeDetectorRef, Component} from '@angular/core';
import {Kanban} from "@models/Kanban";
import {Task, TaskStatus} from "@models/Task";
import {User} from "@models/user";
import {DialogTaskComponent} from "@shared/dialogs/dialog-task/dialog-task.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {TaskService} from "@services/task.service";
import {UserService} from "@services/user.service";
import {ApiResponse} from "@models/application";

@Component({
  selector: 'app-tender-kanban',
  templateUrl: './tender-kanban.component.html',
  styleUrl: './tender-kanban.component.scss'
})
export class TenderKanbanComponent {
  data: Kanban<Task> = {}
  users: User[] = [];
  status: TaskStatus[] = []

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _taskService: TaskService,
    private readonly _userService: UserService,
    private cdr: ChangeDetectorRef
  ) {

    _taskService.getStatusTasks().subscribe((response: ApiResponse<TaskStatus[]>) => {
      if (response.data) {
        this.status = response.data;
        response.data.forEach((status: TaskStatus) => {
          this.data[status.name] = []
        })
      }
    });


    this._userService.getUsersAll().subscribe((response: ApiResponse<User[]>) => {
      if (response.data) {
        this.users = response.data
      }
    })
    this.getTasks();
  }


  getTasks() {
    this._taskService.getTasks().subscribe((response: ApiResponse<Task[]>) => {
      if (response.data) {
        response.data.forEach((task: Task) => {
          const name = this.status.find((status) => status.id === task.task_status_id)?.name;
          if (name) this.data[name].push(task);
        })
        this.cdr.detectChanges();
      }
    })
  }

  taskMoved($event: Task) {
    this._taskService.updateTask($event).subscribe(
      {
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }


  openDialogTask(task?: Task) {
    this._dialog
      .open(DialogTaskComponent, {
        data: {task, status: this.status, users: this.users},
        width: '80%',
        maxWidth: '400px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res: TaskStatus) => {
        if (res) {
          res.id ? this._patchTask(res.id, res) : this._postTask(res);
        }
        this._taskService.getStatusTasks().subscribe((response: ApiResponse<TaskStatus[]>) => {
          if (response.data) {
            this.status = response.data;
            response.data.forEach((status: TaskStatus) => {
              this.data[status.name] = []
            })
          }
        });
      });
  }

  private _postTask(res: TaskStatus) {

    this._taskService.createTask(res).subscribe(
      {
        next: (response) => {

          this.status.forEach((status: TaskStatus) => {
            this.data[status.name] = []
          })

          this.getTasks();
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }

  deleteTask($event: Task) {
    if (!$event?.id) return;

    this._taskService.deleteTask($event).subscribe(
      {
        next: (response: ApiResponse<Task>) => {
          if (response.data) {
            this._toastr.success('Tarefa excluída com sucesso!');

            this.status.forEach((status: TaskStatus) => {
              this.data[status.name] = []
            })
            this.getTasks();
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }

  private _patchTask(id: number, res: TaskStatus) {
    this._taskService.putTask(id, res).subscribe(
      {
        next: (response: ApiResponse<Task>) => {
          if (response.data) {
            this._toastr.success('Tarefa alterada com sucesso!');

            this.status.forEach((status: TaskStatus) => {
              this.data[status.name] = []
            })

            this.getTasks();
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }
}
