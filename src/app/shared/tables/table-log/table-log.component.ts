import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Order, PageControl} from "@models/application";
import {ToastrService} from "ngx-toastr";
import {finalize} from "rxjs";
import {Log} from "@models/Log";
import {LogService} from "@services/log.service";

@Component({
  selector: 'app-table-log',
  templateUrl: './table-log.component.html',
  styleUrl: './table-log.component.scss'
})
export class TableLogComponent implements OnChanges {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onLogClick: EventEmitter<Log> = new EventEmitter<Log>();

  public logs: Log[] = [];

  public columns = [
    {
      slug: "id",
      order: true,
      title: "#",
      align: "justify-content-center",
    },
    {
      slug: "user_id",
      order: true,
      title: "Usuário",
      align: "justify-content-center",
    },
    {
      slug: "description",
      order: true,
      title: "Descrição",
      align: "justify-content-center",
    },
    {
      slug: "created_at",
      order: true,
      title: "Criado em",
      align: "justify-content-center",
    },
    // {
    //   slug: "",
    //   order: true,
    //   title: "Ações",
    //   align: "justify-content-center",
    // },
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
    private readonly _LogService: LogService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {searchTerm, loading, type} = changes;

    if (searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue) {
      this._onSearch();
    } else if (type?.previousValue && type?.currentValue !== type?.previousValue) {
      this._onSearch();
    } else if (!loading?.currentValue) {
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

    this._LogService
      .getLogs(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
        this.logs = res.data;

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

  protected readonly Number = Number;
}
