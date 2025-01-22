import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SupplierClient } from '@models/supplierClient';
import { SupplierService } from '@services/supplier.service';
import { DialogSupplierComponent } from '@shared/dialogs/dialog-supplier/dialog-supplier.component';
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
            const id = +res.get('id');
            if (id) this._patchSupplier(res);
            else this._postSupplier(res);
          }
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
}
