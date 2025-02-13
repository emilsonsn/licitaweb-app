import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Product} from "@models/product";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ProductService} from "@services/product.service";
import {ToastrService} from "ngx-toastr";
import {Order, PageControl} from "@models/application";
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {DialogProductComponent} from "@shared/dialogs/dialog-product/dialog-product.component";
import {TenderItemService} from "@services/tender-item.service";

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
  searchTerm$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DialogProductViewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _productService: ProductService,
    private fb: FormBuilder,
    private _tenderItemService: TenderItemService,
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      product: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filters.search_term = term;
      this.search();
    });

    this._tenderItemService.search({id: this.data.$event}).pipe().subscribe({
      next: res => {
        this.selectedProducts = new MatTableDataSource(res.data);
      },
      error: err => {
        this._toastr.error(
          err?.error?.message || "Ocorreu um erro ao buscar os dados"
        );
      }
    });

    this.search();
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

  editingProductIndex: number | null = null; // Armazena o índice do item em edição

  addProduct() {
    if (this.productForm.valid) {
      const { product, quantity } = this.productForm.value;

      if (this.editingProductIndex !== null) {
        // Se estamos editando, atualizamos os dados do item selecionado
        this.selectedProducts.data[this.editingProductIndex] = { product, quantity };
        this.editingProductIndex = null; // Resetamos o índice após editar
      } else {
        // Verifica se o produto já existe na lista
        const existingProduct = this.selectedProducts.data.find(item => item.product.id === product.id);

        if (existingProduct) {
          // Se já existir, apenas soma a quantidade
          existingProduct.quantity += quantity;
        } else {
          // Se não existir, adiciona o novo produto
          this.selectedProducts.data.push({ product, quantity });
        }
      }

      // Atualiza a tabela
      this.selectedProducts._updateChangeSubscription();

      // Reseta o formulário
      this.productForm.reset({ quantity: 1 });
    }
  }

  editProduct(item: { product: Product; quantity: number }) {
    // Define os valores no formulário de edição
    this.productForm.setValue({
      product: item.product,
      quantity: item.quantity
    });

    // Armazena o índice do item em edição
    this.editingProductIndex = this.selectedProducts.data.indexOf(item);
  }

  removeProduct(index: number) {
    this.selectedProducts.data.splice(index, 1);
    this.selectedProducts._updateChangeSubscription();
  }


  compareProducts(p1: Product, p2: Product): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }


  save() {

    let tenderItens = this.selectedProducts.data.map(item => ({
      product_id: item.product.id,
      tender_id: this.data.$event,
      quantity: item.quantity
    }));

    this._tenderItemService.create({tenderItens})
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        }
    })

    this.dialogRef.close();

  }

  cancel() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateProductDialog() {
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
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this._postProduct(res);
            this.search();
          }
        }
      })
  }

  _postProduct(product) {
    this._productService
      .postProduct(product)
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
