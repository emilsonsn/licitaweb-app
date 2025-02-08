import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupplierClient } from '@models/supplierClient';
import { FiltersService } from '@services/filters-service.service';
import { SupplierService } from '@services/supplier.service';

@Component({
  selector: 'app-dialog-fiter-product',
  templateUrl: './dialog-fiter-product.component.html',
  styleUrl: './dialog-fiter-product.component.scss'
})
export class DialogFiterProductComponent {
  protected form: FormGroup;
  public suppliers: SupplierClient[];
  public flags = ['Verde', 'Amarelo', 'Vermelho'];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly dialogRef: MatDialogRef<DialogFiterProductComponent>,
    private readonly _fb: FormBuilder,
    private _supplierService: SupplierService,
    private filtersService: FiltersService,

  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      search_term: [''],
      supplier_id: [''],
    });

    if (this._data) {
      this.form.patchValue(this._data);
    }

    this.getSuppliers();
    const savedFilters = this.filtersService.getFilters('Product');
    if (savedFilters) {
      this.form.patchValue(savedFilters);
    }
  }

  public getSuppliers() {
    this._supplierService.getSuppliers()
      .subscribe((supplier) => {
        this.suppliers = supplier.data;
      });
  }

  public onConfirm(): void {
    this.filtersService.setFilters(this.form.value, 'Product');
    if (!this.form.valid) return;

    this.dialogRef.close({
      clear: false,
      filters: {
        ...this.form.getRawValue(),
      }
    });
  }

  public onCancel(clear?: boolean): void {
    if (clear) {
      this.dialogRef.close({ 'clear': true });
      this.filtersService.setFilters(null, 'Product');
    }
    else
      this.dialogRef.close();
  }
}
