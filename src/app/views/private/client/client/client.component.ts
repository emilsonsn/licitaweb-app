import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogCollaboratorComponent } from '@shared/dialogs/dialog-collaborator/dialog-collaborator.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ISmallInformationCard } from '@models/cardInformation';
import { ClientService } from '@services/client.service';
import { Client } from '@models/client';
import { DialogClientComponent } from '@shared/dialogs/dialog-client/dialog-client.component';
import { DialogFilterClientComponent } from '@shared/dialogs/filters/dialog-filter-client/dialog-filter-client.component';
import { FiltersService } from '@services/filters-service.service';
import { DialogOcurrenceComponent } from '@shared/dialogs/dialog-ocurrence/dialog-ocurrence.component';
import { DialogOccurrenceClientComponent } from '@shared/dialogs/dialog-occurrence-client/dialog-occurrence-client.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  public filtersFromDialog;
  public loading: boolean = false;
  public filters;

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
    private readonly _clientService: ClientService,
    private readonly filtersService: FiltersService,

  ) {
    this.getFilters();
  }

  ngOnDestroy() {
    this.filtersService.setFilters(null, 'Client');
  }
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogClient(data?) {
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
            const id = +res.get('id');
            if (id) this._patchClient(res);
            else this._postClient(res);
          }
        }
      })
  }

  public openClientFilterDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogFilterClientComponent, {
        data: { ...this.filtersFromDialog },
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {

          if (res) {
            this.filters = {
              ...res.filters,
            };

            !res.clear ? this.filtersFromDialog = (res.filters) : this.filtersFromDialog = null;
          }
        }
      })
  }
  public openOcurrenceDialog(id) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogOccurrenceClientComponent, {
        data: { id },
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (occurrence) => {
          // if (occurrence) {
          //   this.createOccurrence(occurrence);
          // }
        }
      })
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
      .open(DialogConfirmComponent, { data: { text } })
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

  public getFilters(): void {
    this.filters = this.filtersService.getFilters('Client');
  }
}
