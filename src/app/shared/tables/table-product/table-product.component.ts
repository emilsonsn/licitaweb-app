import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Product } from '@models/product';
import { ProductService } from '@services/product.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-product',
  templateUrl: './table-product.component.html',
  styleUrl: './table-product.component.scss'
})
export class TableProductComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onProductClick: EventEmitter<Product> = new EventEmitter<Product>();

  @Output()
  onDeleteProductClick: EventEmitter<number> =
    new EventEmitter<number>();

  @Output()
  openHistoricalProductClick: EventEmitter<number> =
    new EventEmitter<number>();

  public products: Product[] = [];

  public columns = [
    {
      slug: "sku",
      order: true,
      title: "Código",
      align: "start",
    },
    {
      slug: "name",
      order: true,
      title: "Nome",
      align: "start",
    },
    {
      slug: "brand",
      order: true,
      title: "Marca",
      align: "start",
    },
    {
      slug: "purchase_cost",
      order: true,
      title: "Preço",
      align: "justify-content-center",
    },
    {
      slug: "taxes_fees",
      order: true,
      title: "Taxas",
      align: "justify-content-center",
    },{
      slug: "freight",
      order: true,
      title: "Frete",
      align: "justify-content-center",
    },{
      slug: "profit_margin",
      order: true,
      title: "Margem de Lucro %",
      align: "justify-content-center",
    },
    {
      slug: "total_cost",
      order: true,
      title: "Total",
      align: "justify-content-center",
    },
    {
      slug: "",
      order: true,
      title: "Ações",
      align: "justify-content-center",
    },
  ];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _productService: ProductService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if (searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    } else if (filters?.previousValue && filters?.currentValue) {
      this._onSearch();
    }
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    this._initOrStopLoading();
    this._productService
      .getProducts(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: res => {
          this.products = res.data;

          this.pageControl.page = res.current_page - 1;
          this.pageControl.itemCount = res.total;
          this.pageControl.pageCount = res.last_page;
        },
        error: err => {
          this._toastr.error(
            err?.error?.message || "Ocorreu um erro ao buscar os dados"
          );
        }
      });
  }

  onClickOrderBy(slug: string, order: boolean) {
    if (!order) {
      return;
    }

    if (this.pageControl.orderField === slug) {
      this.pageControl.order =
        this.pageControl.order === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.pageControl.order = Order.ASC;
      this.pageControl.orderField = slug;
    }
    this.pageControl.page = 1;
    this.search();
  }

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }
}
