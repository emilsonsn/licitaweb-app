import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotificationItem, NotificationStatus } from "@models/INotificationItem";
import {NotificationService} from "@services/notification.service";

@Component({
  selector: 'app-notification-items',
  templateUrl: './notification-items.component.html',
  styleUrls: ['./notification-items.component.scss']
})
export class NotificationItemsComponent {
  title: string = 'Notificações';

  @Input()
  items: INotificationItem[] = [];  // Garante que sempre será um array, mesmo vazio

  @Output()
  closeEvent: EventEmitter<Event> = new EventEmitter<Event>();

  close(event: Event) {
    this.closeEvent.emit(event);
  }

  constructor(private readonly _notificationService: NotificationService) {
  }

  removeItem(item: INotificationItem, event: Event) {
    event.stopPropagation();
    // Verifica se o item existe e se está na lista
    const index = this.items.findIndex(x => x === item);
    const x = this.items[index];
    if (index !== -1) {
      this._notificationService.viewed(x.id).subscribe(
        () => {
          this.items.splice(index, 1);
        }
      );
    }
  }

  clearAll(event: Event) {
    // Garante que items não seja undefined ou vazio antes de processar
    if (this.items && this.items.length > 0) {
      this.items.forEach(x => {
        this._notificationService.viewed(x.id).subscribe(() => {
          x.status = NotificationStatus.READ;
        });
      });
    }
    this.closeEvent.emit(event);
  }

  protected readonly NotificationStatus = NotificationStatus;

  confirmAllReads(): boolean {
    // Verifica se existe pelo menos um item antes de verificar o status
    return this.items?.length ? this.items.every(x => x.status === NotificationStatus.READ) : true;
  }
}
