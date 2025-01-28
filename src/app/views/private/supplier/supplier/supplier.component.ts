import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SupplierClient } from '@models/supplierClient';
import { SupplierService } from '@services/supplier.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogOccurrenceSupplierComponent } from '@shared/dialogs/dialog-occurrence-supplier/dialog-occurrence-supplier.component';
import { DialogSupplierComponent } from '@shared/dialogs/dialog-supplier/dialog-supplier.component';
import { DialogFilterSupplierComponent } from '@shared/dialogs/filters/dialog-filter-supplier/dialog-filter-supplier.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent {
  public filtersFromDialog;
  public loading: boolean = false;
  public filters;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _supplier: SupplierService,

  ) {
  }

  openDialogSupplier(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogSupplierComponent, {
        ...dialogConfig,
        data: data ? { ...data } : null
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            const id = +res.id;
            if (id) this._patchSupplier(res);
            else this._postSupplier(res);
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
        .open(DialogOccurrenceSupplierComponent, {
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
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }
  _postSupplier(supplier: SupplierClient) {
    this._initOrStopLoading();

    this._supplier
      .postSupplier(supplier)
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
  _patchSupplier(supplier) {
    this._initOrStopLoading();
    const id = +supplier.get('id');
    this._supplier
      .patchSupplier(id, supplier)
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
  onDeleteSupplier(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteSupplier(id);
        }
      });
  }

  _deleteSupplier(id: number) {
    this._initOrStopLoading();
    this._supplier
      .deleteSupplier(id)
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

  public openSupplierFilterDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogFilterSupplierComponent, {
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
}
