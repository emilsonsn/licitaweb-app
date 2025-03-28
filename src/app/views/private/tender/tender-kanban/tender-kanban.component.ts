import {ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Kanban} from "@models/Kanban";
import {Task, TaskStatus} from "@models/Task";
import {User} from "@models/user";
import {DialogStepComponent} from "@shared/dialogs/dialog-step/dialog-step.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {TaskService} from "@services/task.service";
import {UserService} from "@services/user.service";
import {ApiResponse} from "@models/application";
import {TenderService} from "@services/tender.service";
import {Tender} from "@models/tender";

@Component({
  selector: 'app-tender-kanban',
  templateUrl: './tender-kanban.component.html',
  styleUrl: './tender-kanban.component.scss'
})
export class TenderKanbanComponent {
  data: Kanban<Task> = {}
  users: User[] = [];
  status: TaskStatus[] = []
  tenders: Tender[] = []

  @Output()
  cardMoved: EventEmitter<any> = new EventEmitter();
  @Input() loading!: boolean;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _taskService: TaskService,
    private readonly _userService: UserService,
    private readonly _tenderService: TenderService,
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

  ngOnChanges(changes: SimpleChanges): void {
    const {loading} = changes;
    if (loading) {
      this.getTasks();
    }
  }


  getTasks() {
    this._tenderService.getTenders().subscribe((response) => {
      if (response.data) {
        // Limpa todas as listas em this.data
        Object.keys(this.data).forEach((key) => {
          this.data[key] = [];
        });

        response.data.forEach((tender: Tender) => {
          const name = this.status.find(
            (status) => status.id === tender.tender_status[0].status_id
          )?.name;

          const task: Task = {
            id: tender.id.toString(),
            user_id: tender.user_id,
            name: tender.number,
            description: tender.organ,
            status: tender.status,
            contest_date: tender.contest_date,
            estimated_value: tender.estimated_value,
            task_status_id: tender.tender_status[0].status_id,
            sub_tasks: [],
            tasks_files: [],
            files: [],
            user: tender.user,
          };

          if (name) {
            // Verifica se a tarefa já existe na lista
            const existingTask = this.data[name].find((existing) => existing.id === task.id);
            if (!existingTask) {
              this.data[name].push(task);
            }
          }
        });

        this.tenders = response.data;

        this.cdr.detectChanges();
      }
    });
  }



  taskMoved($event: Task) {
    const tender = this.tenders.find((tender) => tender.id === Number($event.id));

    tender.tender_status[0].status_id = $event.task_status_id;

    this._taskService.updateTender(tender).subscribe(
      {
        next: () => {
          this.cardMoved.emit(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }


  openDialogTask(task?: TaskStatus) {
    this._dialog
      .open(DialogStepComponent, {
        data: {id: task?.id, name: task?.name, color: task?.color},
        width: '80%',
        maxWidth: '400px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res: TaskStatus) => {
        if (res) {
          res.id ? this._patchTask(res.id, res) : this._postTask(res);
        }
        this.getStatus();
      });
  }

  private _postTask(res: TaskStatus) {

    this._taskService.createTaskStatus(res).subscribe(
      {
        next: (response) => {
          this._toastr.success('Etapa salva com sucesso!');
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

    this._tenderService.deleteTender(+$event.id).subscribe(
      {
        next: (response) => {
          if (response) {
            this._toastr.success('Tarefa excluída com sucesso!');

            this.status.forEach((status: TaskStatus) => {
              this.data[status.name] = []
            })
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }

  private _patchTask(id: number, res: TaskStatus) {
    this._taskService.updateTaskStatus(res).subscribe(
      {
        next: (response) => {
          this._toastr.success('Etapa atualizada com sucesso!');
          this.getTasks();
          // this.status = [];
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }

  editColumnStatus($event: string) {
    const taskStatus = this.status.find((status) => status.name === $event);
    this.openDialogTask(taskStatus);
  }

  getStatus() {
    this.status = [];
    this.data = {};
    this._taskService.getStatusTasks().subscribe((response: ApiResponse<TaskStatus[]>) => {
      if (response.data) {
        this.status = response.data;
        response.data.forEach((status: TaskStatus) => {
          this.data[status.name] = []
        })
      }
    });
  }

  deleteColumnStatus($event: string) {
    const taskStatus = this.status.find((status) => status.name === $event);
    this._taskService.deleteTaskStatus(taskStatus).subscribe(
      {
        next: (response: ApiResponse<TaskStatus>) => {
          if (response.data) {
            this._toastr.success('Etapa excluído com sucesso!');
            this.getStatus();
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }
}
