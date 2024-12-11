import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ISmallInformationCard } from '@models/cardInformation';
import { ToastrService } from 'ngx-toastr';

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
  ) {
  }

  ngOnInit(): void {
    // this._getCards();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  /* openDialogCollaborator(user?: User) {
    this._dialog
      .open(DialogCollaboratorComponent, {
        data: {user},
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const id = +res.get('id');
          if (id) {
            this._patchCollaborator(res);
            return;
          }

          this._postCollaborator(res);
        }
      });
  }

  _getCards() {
    this._initOrStopLoading();

    this._userService
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
      });
  } */
}
