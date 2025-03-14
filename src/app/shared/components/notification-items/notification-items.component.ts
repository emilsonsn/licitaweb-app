import {Component, EventEmitter, Input, Output} from '@angular/core';
import {INotificationItem, NotificationStatus} from "@models/INotificationItem";

@Component({
  selector: 'app-notification-items',
  templateUrl: './notification-items.component.html',
  styleUrl: './notification-items.component.scss'
})
export class NotificationItemsComponent {
  title: string = 'Notificações';

  @Input()
  items: INotificationItem[];
  @Output()
  closeEvent: EventEmitter<Event> = new EventEmitter<Event>();

  close(event: Event) {
    this.closeEvent.emit(event);
  }

  removeItem(item: INotificationItem, event: Event) {
    event.stopPropagation();
    const index = this.items.findIndex(x => x === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  clearAll(event: Event) {
    this.items.forEach(x => x.status = NotificationStatus.READ);
    this.closeEvent.emit(event);
  }

  protected readonly NotificationStatus = NotificationStatus;

  confirmAllReads(): boolean {
    return this.items.every(x => x.status === NotificationStatus.READ);
  }
}
