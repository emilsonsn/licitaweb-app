import {Component, OnInit} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {CalendarOptions} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import {DialogEventComponent} from '@shared/dialogs/dialog-task/dialog-event.component';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {EventTaskService} from "@services/event.service";

@Component({
  selector: 'app-tender-task',
  templateUrl: './tender-task.component.html',
  styleUrls: ['./tender-task.component.scss']
})
export class TenderTaskComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locale: 'pt-br',
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
          // Map IEventTask to EventInput
          this.calendarOptions.events = response.data.map(task => ({
            id: String(task.id), // Ensure id is a string
            title: task.name,     // Map the appropriate fields
            start: task.due_date, // Adjust according to the data structure
            description: task.description, // Map any other required fields
            // Map any additional necessary properties
          }));
        },
        error: (err) => {
          this._toastr.error("Erro ao carregar eventos");
        }
      }
    );
  }



  openEventDialog(eventData): void {
    console.log(eventData);
    const dialogRef = this.dialog.open(DialogEventComponent, {
      width: '300px',
      data: {
        ...eventData,
        due_date: eventData.date || eventData.due_date || '' // Garante que a data seja passada
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
            },
            error: (err) => {
              this._toastr.error(err.error.error);
            }
          }
        );
        break;
      case 'edit':
        /* this._eventService.updateEvent(event.id, event).subscribe(
           {
             next: (response) => {
               this.calendarOptions.events = (this.calendarOptions.events as any).map(ev =>
                 ev.id === event.id ? response.data : ev
               );
               this._toastr.success("Tarefa atualizada com sucesso");
             },
             error: (err) => {
               this._toastr.error(err.error.error);
             }
           }
         );*/
        break;
      case 'delete':
        this._eventService.deleteIEventTask(event.id).subscribe(
          {
            next: () => {
              this.calendarOptions.events = (this.calendarOptions.events as any).filter(ev => ev.id !== event.id);
              this._toastr.success("Tarefa excluída com sucesso");
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
