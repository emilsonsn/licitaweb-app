import {Component} from '@angular/core';

interface INotificationItem {
  title: string;
  body: string;
  date: Date;
}

@Component({
  selector: 'app-notification-items',
  templateUrl: './notification-items.component.html',
  styleUrl: './notification-items.component.scss'
})
export class NotificationItemsComponent {
  title: string = 'Notificações';

  items: INotificationItem[] = [
    {
      title: 'Título da notificação 1',
      body: 'Descrição da notificação',
      date: new Date()
    },
    {
      title: 'Título da notificação 2',
      body: 'Descrição da notificação',
      date: new Date()
    },
    {
      title: 'Título da notificação 3',
      body: 'Descrição da notificação',
      date: new Date()
    },
    {
      title: 'Título da notificação 4',
      body: 'Descrição da notificação',
      date: new Date()
    }
  ]

  close() {

  }

  removeItem(item: INotificationItem) {

  }
}
