import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Product } from '@models/product';
import { ProductService } from '@services/product.service';
import { debounceTime, map, ReplaySubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialog-contract-product',
  templateUrl: './dialog-contract-product.component.html',
  styleUrl: './dialog-contract-product.component.scss',
})
export class DialogContractProductComponent {
  protected editMode: boolean = false;
  protected _onDestroy = new Subject<void>();
  protected form: FormGroup;

  // Auto Complete
  protected ALL_PRODUCTS: Product[] = [];
  protected productsCtrl: FormControl<Product> = new FormControl<Product>(null);
  protected productsFilterCtrl: FormControl<string> = new FormControl<string>(
    ''
  );
  protected filteredProducts: ReplaySubject<Product[]> = new ReplaySubject<
    Product[]
  >();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: { contract_id: number },
    protected readonly dialogRef: MatDialogRef<DialogContractProductComponent>,
    private readonly _fb: FormBuilder,
    private readonly _productService: ProductService
  ) {
    this._productService.getProducts().subscribe((res) => {
      this.ALL_PRODUCTS = res.data;
      this.filteredProducts.next(res.data);
      this.prepareFilterProductsCtrl();
    });
  }

  ngOnInit() {
    this.form = this._fb.group({
      product_id: [null, [Validators.required]],
      contract_id: [this._data.contract_id],
      quantity: [null, [Validators.required, Validators.min(1)]],
      sale_value: [null, [Validators.required, Validators.min(0.01)]],
    });

    this.manageUnitPrice();
  }

  protected onSubmit() {

  }

  // Products
  private manageUnitPrice() {
    this.form.get('sale_value').disable();

    this.form.get('product_id').valueChanges.subscribe((res) => {
      if (res) {
        this.form.patchValue({
          sale_value: this.ALL_PRODUCTS.find((p) => p.id == res).sale_price,
        });
        this.form.get('sale_value').enable();
      }
    });
  }

  // Utils
  protected onCancel() {
    this.dialogRef.close();
  }

  // Filters
  protected prepareFilterProductsCtrl() {
    this.productsFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.ALL_PRODUCTS.slice();
          } else {
            search = search.toLowerCase();
            return this.ALL_PRODUCTS.filter(
              (product) =>
                product.name?.toString().toLowerCase().includes(search) ||
                product.sku?.toString().toLowerCase().includes(search) ||
                product.category?.toString().toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredProducts.next(filtered);
      });
  }
}
