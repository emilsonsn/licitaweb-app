import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OriginEnum, Product } from '@models/product';
import { SupplierClient } from '@models/supplierClient';
import { SupplierService } from '@services/supplier.service';
import { UtilsService } from '@services/utils.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-product',
  templateUrl: './dialog-product.component.html',
  styleUrl: './dialog-product.component.scss'
})
export class DialogProductComponent {

  public isNewProduct: boolean = true;
  public title: string = 'Novo produto';
  public OriginEnum : string[] = Object.values(OriginEnum);

  public form: FormGroup;
  public suppliers: SupplierClient[];

  public loading : boolean = false;

  public utils = Utils;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {product : Product},
    private readonly _dialogRef: MatDialogRef<DialogProductComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _utilsService : UtilsService,
    private readonly _supplierService : SupplierService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      sku: [null, [Validators.required]],
      category: [null, [Validators.required]],
      detailed_description: [null, [Validators.required]],
      technical_information: [null, [Validators.required]],
      size: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      origin: [null, [Validators.required]],
      model: [null, [Validators.required]],
      purchase_cost: [null, [Validators.required]],
      freight: [null, [Validators.required]],
      taxes_fees: [null, [Validators.required]],
      // total_cost: [null, [Validators.required]],
      profit_margin: [null, [Validators.required]],
      // sale_price: [null, [Validators.required]],
      supplier_id: [null, [Validators.required]],
    });

    this._supplierService.getSuppliers().subscribe()

    if (this._data) {
      this.isNewProduct = false;
      this.title = 'Editar produto';
      this._fillForm(this._data.product);
    }

    this.getSuppliers();

    this.form.patchValue({
      ...this._data,
    });
  }

  private getSuppliers() {
    this._supplierService.getSuppliers()
      .subscribe((res) => {
        this.suppliers = res.data;
      });
  }

  private _fillForm(product: Product): void {
    this.form.patchValue(product);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if(!form.valid){
      form.markAllAsTouched();
    }else{
      this._dialogRef.close(form.getRawValue())
    }
  }

}
