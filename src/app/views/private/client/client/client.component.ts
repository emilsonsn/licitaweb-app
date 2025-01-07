import {Component} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {DialogCollaboratorComponent} from '@shared/dialogs/dialog-collaborator/dialog-collaborator.component';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs';
import {ISmallInformationCard} from '@models/cardInformation';
import { ClientService } from '@services/client.service';
import { Client } from '@models/client';
import { DialogClientComponent } from '@shared/dialogs/dialog-client/dialog-client.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  public loading: boolean = false;

  protected itemsRequests: ISmallInformationCard[] = [
    {
      icon: 'fa-solid fa-circle-check',
      background: '#4CA750',
      title: '0',
      category: 'Usuários',
      description: 'Usuários ativos',
    },
    {
      icon: 'fa-solid fa-ban',
      background: '#dc3545',
      title: '0',
      category: 'Usuários',
      description: 'Usuários bloqueados',
    },
    {
      icon: 'fa-solid fa-users',
      // background: '#dc3545',
      title: '0',
      category: 'Usuários',
      description: 'Usuários totais',
    },
  ]

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _clientService: ClientService
  ) {
  }

  ngOnInit(): void {
    this._getCards();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogClient(data?) {
    debugger
    const dialogConfig: MatDialogConfig = {
          width: '80%',
          maxWidth: '1000px',
          maxHeight: '90%',
          hasBackdrop: true,
          closeOnNavigation: true,
        };

    this._dialog
      .open(DialogClientComponent, {
        ...dialogConfig,
        data: data ? { ...data } : null
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            const id = res.get('id');
            if (id) this._patchClient(res);
            else this._postClient(res);
          }
        }
      })
  }

  _getCards() {
    // this._initOrStopLoading();

    // this._clientService
    //   .getCards()
    //   .pipe(finalize(() => this._initOrStopLoading()))
    //   .subscribe({
    //     next: (res) => {
    //       this.itemsRequests = [
    //         {
    //           icon: 'fa-solid fa-circle-check',
    //           background: '#4CA750',
    //           title: `${res.data.active}`,
    //           category: 'Usuários',
    //           description: 'Usuários ativos',
    //         },
    //         {
    //           icon: 'fa-solid fa-ban',
    //           background: '#dc3545',
    //           title: `${res.data.inactive}`,
    //           category: 'Usuários',
    //           description: 'Usuários bloqueados',
    //         },
    //         {
    //           icon: 'fa-solid fa-users',
    //           // background: '#dc3545',
    //           title: `${res.data.total}`,
    //           category: 'Usuários',
    //           description: 'Usuários totais',
    //         },
    //       ]
    //     },
    //     error: (err) => {
    //       this._toastr.error(err.error.error);
    //     },
    //   });
  }

  _patchClient(client) {
    this._initOrStopLoading();
    const id = +client.get('id');
    this._clientService
      .patchClient(id, client)
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

  _postClient(client: Client) {
    this._initOrStopLoading();

    this._clientService
      .postClient(client)
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

  onDeleteCollaborator(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, {data: {text}})
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteCollaborator(id);
        }
      });
  }

  _deleteCollaborator(id: number) {
    this._initOrStopLoading();
    this._clientService
      .deleteClient(id)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }
}
