import {Component, Inject, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { Product } from "@models/product";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProductService } from "@services/product.service";
import { ToastrService } from "ngx-toastr";
import { Order, PageControl } from "@models/application";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-dialog-product-views',
  templateUrl: './dialog-product-views.component.html',
  styleUrl: './dialog-product-views.component.scss'
})
export class DialogProductViewsComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  products: Product[] = [];
  selectedProducts: MatTableDataSource<{ product: Product; quantity: number }> = new MatTableDataSource([]);
  pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  filters: { search_term?: string } = { search_term: '' };
  public search_term: FormControl<string> = new FormControl<string>('');
  searchTerm$ = new Subject<string>(); // Subject para capturar mudanças no input
  private destroy$ = new Subject<void>(); // Para cancelar subscrição ao destruir o componente

  constructor(
    public dialogRef: MatDialogRef<DialogProductViewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _productService: ProductService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private readonly _toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      product: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.products = data.products || [];
  }

  ngOnInit(): void {
    // Observa mudanças no search_term e espera 500ms antes de buscar
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$) // Cancela ao destruir o componente
    ).subscribe(term => {
      this.filters.search_term = term;
      this.search();
    });

    this.search(); // Busca inicial
  }

  search(): void {
    this._productService
      .getProducts(this.pageControl, this.filters)
      .subscribe({
        next: res => {
          this.products = res.data;
        },
        error: err => {
          this._toastr.error(
            err?.error?.message || "Ocorreu um erro ao buscar os dados"
          );
        }
      });
  }

  onSearchTermChange(term: string): void {
    this.searchTerm$.next(term);
  }

  addProduct() {
    if (this.productForm.valid) {
      const { product, quantity } = this.productForm.value;
      this.selectedProducts.data.push({ product, quantity });  // Adiciona ao array de dados
      this.selectedProducts._updateChangeSubscription();  // Atualiza a tabela
      this.productForm.reset({ quantity: 1 });
    }
  }


  removeProduct(index: number) {

  }

  trackByFn(index: number, item: any) {
    return item.product.id; // Supondo que o 'product' tenha um campo 'id'
  }


  editProduct(index: number) {
    const selectedItem = this.selectedProducts[index];
    this.productForm.setValue({
      product: selectedItem.product,
      quantity: selectedItem.quantity
    });
    this.removeProduct(index);
  }

  save() {
    this.dialogRef.close(this.selectedProducts);
  }

  cancel() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
