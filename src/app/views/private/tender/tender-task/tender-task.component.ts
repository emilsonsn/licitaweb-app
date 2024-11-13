import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {CalendarOptions} from "@fullcalendar/core"; // Plugin de exibição diária
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-tender-task',
  templateUrl: './tender-task.component.html',
  styleUrls: ['./tender-task.component.scss']
})
export class TenderTaskComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2019-04-01' },
      { title: 'event 2', date: '2019-04-02' }
    ]
  };

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }
}
