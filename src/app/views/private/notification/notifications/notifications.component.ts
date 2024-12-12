import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ISmallInformationCard } from '@models/cardInformation';
import { NotificationService } from '@services/notification.service';
import { DialogsNotificationComponent } from '@shared/dialogs/dialogs-notification/dialogs-notification.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  loading = false;
  protected itemsRequests: ISmallInformationCard[] = [
    {
      icon: 'fa-solid fa-circle-check',
      background: '#4CA750',
      title: '0',
      category: 'Notificações',
      description: 'Notificações ativas',
    },
    {
      icon: 'fa-solid fa-ban',
      background: '#dc3545',
      title: '0',
      category: 'Notificações',
      description: 'Notificações bloqueadas',
    },
    {
      icon: 'fa-solid fa-users',
      // background: '#dc3545',
      title: '0',
      category: 'Notificações',
      description: 'Notificações totais',
    },
  ]

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this._getCards();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogNotification(notification?: Notification) {
    this._dialog
      .open(DialogsNotificationComponent, {
        data: {notification},
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const id = +res.get('id');
          if (id) {
            this._patchNotification(res);
            return;
          }
          this._postNotification(res);
        }
      });
  }

  _patchNotification(notification: FormData) {
    this._initOrStopLoading();
    const id = +notification.get('id');
    this._notificationService
      .patch(id, notification)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _postNotification(notification: Notification) {
    debugger
    this._initOrStopLoading();

    this._notificationService
      .create(notification)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _getCards() {
    this._initOrStopLoading();

    /* this._userService
      .getCards()
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this.itemsRequests = [
            {
              icon: 'fa-solid fa-circle-check',
              background: '#4CA750',
              title: `${res.data.active}`,
              category: 'Usuários',
              description: 'Usuários ativos',
            },
            {
              icon: 'fa-solid fa-ban',
              background: '#dc3545',
              title: `${res.data.inactive}`,
              category: 'Usuários',
              description: 'Usuários bloqueados',
            },
            {
              icon: 'fa-solid fa-users',
              // background: '#dc3545',
              title: `${res.data.total}`,
              category: 'Usuários',
              description: 'Usuários totais',
            },
          ]
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }); */
  }
}
