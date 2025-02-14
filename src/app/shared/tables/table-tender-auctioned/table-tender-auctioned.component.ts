import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Tender} from "@models/tender";
import {Order, PageControl} from "@models/application";
import {ToastrService} from "ngx-toastr";
import {TenderService} from "@services/tender.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-table-tender-auctioned',
  templateUrl: './table-tender-auctioned.component.html',
  styleUrl: './table-tender-auctioned.component.scss'
})
export class TableTenderAuctionedComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onTenderClick: EventEmitter<Tender> = new EventEmitter<Tender>();

  @Output()
  totalValue: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  onDeleteTenderClick: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  openTaskDialog: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  openOcurrenceDialog: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  openProductViewDialog: EventEmitter<number> = new EventEmitter<number>();

  public tender: Tender[] = [];

  public columns = [
    {
      slug: "number",
      order: true,
      title: "Número",
      align: "justify-content-center",
    },
    {
      slug: "organ",
      order: true,
      title: "Órgão",
      align: "start",
    },
    {
      slug: "contest_date",
      order: true,
      title: "Certame",
      align: "justify-content-center",
    },
    {
      slug: "items_count",
      order: true,
      title: "Qtd. Itens",
      align: "justify-content-center",
    },
    {
      slug: "estimated_value",
      order: true,
      title: "Valor Estimado",
      align: "justify-content-center",
    },
    {
      slug: "status",
      order: true,
      title: "Status",
      align: "justify-content-center",
    },
    {
      slug: "internal_responsible",
      order: true,
      title: "Responsável",
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
    private readonly _tenderService: TenderService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {filters, searchTerm, loading} = changes;

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

    this._tenderService
      .getTenders(this.pageControl, {...this.filters, status_id: 3})
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
        this.tender = res.data;
        const result: any = res;
        this.totalValue.emit(result?.total_value)

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
