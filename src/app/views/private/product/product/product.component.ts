import { Component, LOCALE_ID } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Product } from '@models/product';
import { FiltersService } from '@services/filters-service.service';
import { ProductService } from '@services/product.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogHistoricalProductComponent } from '@shared/dialogs/dialog-historical-product/dialog-historical-product.component';
import { DialogProductComponent } from '@shared/dialogs/dialog-product/dialog-product.component';
import { DialogFiterProductComponent } from '@shared/dialogs/filters/dialog-fiter-product/dialog-fiter-product.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  public filtersFromDialog;
  public loading: boolean = false;
  public filters;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _productService: ProductService,
    private readonly filtersService: FiltersService,

  ) {
    this.getFilters();
  }

  ngOnDestroy() {
    this.filtersService.setFilters(null, 'Product');
  }
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogProduct(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogProductComponent, {
        ...dialogConfig,
        data: data ? { ...data } : null
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            const id = res.get('id');
            if (id) this._patchProduct(res);
            else this._postProduct(res);
          }
        }
      })
  }

  openDialogHistoricalProduct(id: number) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogHistoricalProductComponent, {
        ...dialogConfig,
        data: id
      })
  }

  public openProductFilterDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogFiterProductComponent, {
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


  _patchProduct(product) {
    this._initOrStopLoading();
    const id = product.get('id');
    this._productService
      .patchProduct(id, product)
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

  _postProduct(product) {
    this._initOrStopLoading();

    this._productService
      .postProduct(product)
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

  onDeleteProduct(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteProduct(id);
        }
      });
  }

  _deleteProduct(id: number) {
    this._initOrStopLoading();
    this._productService
      .deleteProduct(id)
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
    this.filters = this.filtersService.getFilters('Product');
  }
}
