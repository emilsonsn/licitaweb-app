import {Component, OnInit} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {CalendarOptions} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {EventTaskService} from "@services/event.service";
import {IEventTask} from "@models/Event";
import {DialogEventComponent} from "@shared/dialogs/dialog-event/dialog-event.component";

@Component({
  selector: 'app-tender-task',
  templateUrl: './tender-task.component.html',
  styleUrls: ['./tender-task.component.scss']
})
export class TenderTaskComponent implements OnInit {
  events: IEventTask[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locale: 'pt-br',
    buttonText: {
      today: 'Hoje'
    },
    dateClick: (arg) => this.openEventDialog({date: arg.dateStr}),
    events: [],
    eventClick: (arg) => this.openEventDialog(arg.event)
  };


  constructor(
    public dialog: MatDialog,
    private readonly _eventService: EventTaskService,
    private readonly _toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this._eventService.getAllIEventTasks().subscribe(
      {
        next: (response) => {

          this.calendarOptions.events = response.data.map(task => ({
            id: String(task.id),
            title: task.name + " | " + task.user.name,
            start: task.due_date,
            end: task.due_date,
            allDay: true,
            backgroundColor: task.status === 'Pending' ? 'orange' :
            task.status === 'InProgress' ? '' :
            task.status === 'Completed' ? 'green' : undefined,
            borderColor: 'transparent'
          }));

          this.events = response.data;
        },
        error: (err) => {
          this._toastr.error("Erro ao carregar eventos");
        }
      }
    );
  }


  openEventDialog(eventData: any): void {
    if (eventData.id) {
      eventData = this.events.find((event) => event.id === +eventData.id);
      eventData.date = eventData.due_date.toString().split(" ")[0];
    }

    const dialogRef = this.dialog.open(DialogEventComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
      data: {
        ...eventData,
        due_date: eventData.date ?? eventData.due_date ?? new Date(),
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleDialogResult(result);
      }
    });
  }

  handleDialogResult(result): void {
    const {action, event} = result;
    switch (action) {
      case 'add':
        this._eventService.createIEventTask(event).subscribe(
          {
            next: (response) => {
              this.calendarOptions.events = [
                ...(this.calendarOptions.events as any),
                response.data
              ];
              this._toastr.success("Tarefa criada com sucesso");
              this.loadEvents();
            },
            error: (err) => {
              this._toastr.error(err.error.error);
            }
          }
        );
        break;
      case 'edit':
        this._eventService.updateEvent(event.id, event).subscribe(
          {
            next: (response) => {
              this.calendarOptions.events = (this.calendarOptions.events as any).map(ev =>
                ev.id === event.id ? response.data : ev
              );
              this._toastr.success("Tarefa atualizada com sucesso");
              this.loadEvents();
            },
            error: (err) => {
              this._toastr.error(err.error.error);
            }
          }
        );
        break;
      case 'delete':
        this._eventService.deleteIEventTask(event.id).subscribe(
          {
            next: () => {
              this.calendarOptions.events = (this.calendarOptions.events as any).filter(ev => ev.id !== event.id);
              this._toastr.success("Tarefa excluída com sucesso");
              this.loadEvents();
            },
            error: (err) => {
              this._toastr.error(err.error.error);
            }
          }
        );
        break;
    }
  }
}
