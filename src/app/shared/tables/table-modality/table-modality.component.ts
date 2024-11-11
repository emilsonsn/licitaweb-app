import { style } from '@angular/animations';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Modality } from '@models/modality';
import { ModalityService } from '@services/modality.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-modality',
  templateUrl: './table-modality.component.html',
  styleUrl: './table-modality.component.scss'
})
export class TableModalityComponent {
  @Input()
  searchTerm?: string = '';

  @Output()
  onModalityClick: EventEmitter<Modality> = new EventEmitter<Modality>();

  @Output()
  onDeleteModalityClick: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  public modality: Modality[] = [];

  public columns = [
    {
      slug: "name",
      order: true,
      title: "Nome",
      align: "center",
    },
    {
      slug: "description",
      order: true,
      title: "Descrição",
      align: "center",
    },
    {
      slug: "",
      order: true,
      title: "Ações",
      align: "justify-content-end",
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
    private readonly _modality: ModalityService,
  ) {}

  ngOnInit(): void {
    this._onSearch(); // Chamada inicial para garantir a busca
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if ( searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue ) {
      this._onSearch();
    }
    else if (!loading?.currentValue) {
      this._onSearch();
    }
    else if(filters?.previousValue && filters?.currentValue) {
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

    this._modality
      .getModalities(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
        this.modality = res.data;

        this.pageControl.page = res.current_page - 1;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
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
