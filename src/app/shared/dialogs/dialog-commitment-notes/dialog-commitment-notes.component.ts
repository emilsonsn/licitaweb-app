import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProductService} from "@services/product.service";
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, startWith, switchMap} from 'rxjs/operators';
import {DEBUG} from "@angular/compiler-cli/src/ngtsc/logging/src/console_logger";


@Component({
  selector: 'app-dialog-commitment-notes',
  templateUrl: './dialog-commitment-notes.component.html',
  styleUrl: './dialog-commitment-notes.component.scss'
})
export class DialogCommitmentNotesComponent implements OnInit {
  notesForm: FormGroup;
  title: string = 'Cadastro de Nota de Empenho';
  isNew: boolean = true;
  loading: boolean;

  productList: any[] = [];
  filteredProducts$: Observable<any[]>;
  productFilterCtrl: FormControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCommitmentNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _productService: ProductService,
  ) {
    this.notesForm = this.fb.group({
      noteNumber: ['', Validators.required],
      receivedDate: ['', Validators.required],
      deliveryDeadline: ['', Validators.required],
      products: this.fb.array([]),
      status: ['Em Aberto', Validators.required],
      observations: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts('');

    this.filteredProducts$ = this.productFilterCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => this.loadProducts(searchTerm))
    );
  }

  get products(): FormArray {
    return this.notesForm.get('products') as FormArray;
  }

  private loadProducts(searchTerm: string): Observable<any[]> {
    return this._productService.getProducts({search_term: searchTerm}).pipe(
      switchMap(res => {
        this.productList = res.data;
        return [this.productList];
      })
    );
  }


  addProduct() {
    const productForm = this.fb.group({
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      sale_price: [0, [Validators.required, Validators.min(0.01)]],
      adjustedPrice: [0, [Validators.required, Validators.min(0.01)]],
      total: [0]
    });
    this.products.push(productForm);
  }


  removeProduct(index: number) {
    this.products.removeAt(index);
  }

  submit() {
    if (this.notesForm.valid) this.dialogRef.close(this.notesForm.value);
  }

  close() {
    this.dialogRef.close();
  }


  incrementQuantity(index: number) {
    const product = this.products.at(index);
    const currentQuantity = parseInt(product.get('quantity')?.value) || 1;
    product.patchValue({quantity: currentQuantity + 1});
    this.updateTotal(index);
  }

  decrementQuantity(index: number) {
    const product = this.products.at(index);
    const currentQuantity = parseInt(product.get('quantity')?.value) || 1;
    if (currentQuantity > 1) {
      product.patchValue({quantity: currentQuantity - 1});
      this.updateTotal(index);
    }
  }


  onProductChange(event: any, index: number) {
    const selectedProductId = event.value;
    const selectedProduct = this.productList.find(prod => prod.id === selectedProductId.id);

    if (selectedProduct) {
      const sale_price = parseFloat(selectedProduct.sale_price) || 0;

      this.products.at(index).patchValue({
        sale_price: sale_price.toFixed(2),
        adjustedPrice: sale_price.toFixed(2)
      });

      this.updateTotal(index);
    }
  }

  validateAdjustedPrice(index: number) {
    console.log(index);
    const product = this.products.at(index);
    if (!product) return;

    const sale_price = parseFloat(product.get('sale_price')?.value) || 0;
    const rawPrice = product.get('adjustedPrice')?.value || '';
    const cleanedPrice = rawPrice.replace(/[^\d,.-]/g, '').replace(',', '.');
    const adjustedPrice = parseFloat(cleanedPrice) || 0;


    /*if (adjustedPrice < sale_price) {
      product.get('adjustedPrice')?.setErrors({invalidPrice: true});
    } else {
      product.get('adjustedPrice')?.setErrors(null);
      this.updateTotal(index);
    }*/

    this.updateTotal(index);
  }

  updateTotal(index: number) {
    const product = this.products.at(index);
    console.log(product);
    if (!product) return;

    const quantity = parseFloat(product.get('quantity')?.value) || 1;
    const rawPrice = product.get('adjustedPrice')?.value || '';
    const cleanedPrice = rawPrice.replace(/[^\d,.-]/g, '').replace(',', '.');
    const adjustedPrice = parseFloat(cleanedPrice) || 0;

    product.patchValue({total: (quantity * adjustedPrice).toFixed(2)});
  }

  getTotal(index: number): string {
    const product = this.products.at(index);
    return (parseFloat(product?.get('total')?.value) || 0).toFixed(2);
  }


  toNumber(value: string | number): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;

    return parseFloat(
      value.replace(/[R$\s]/g, '')
    );
  }

}
