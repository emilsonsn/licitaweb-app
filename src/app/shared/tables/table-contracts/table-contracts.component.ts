import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Order, PageControl} from "@models/application";
import {ToastrService} from "ngx-toastr";
import {finalize} from "rxjs";
import {ContractService} from "@services/contract.service";
import {Contract} from "@models/contract";

@Component({
  selector: 'app-table-contracts',
  templateUrl: './table-contracts.component.html',
  styleUrl: './table-contracts.component.scss'
})
export class TableContractsComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onEditContractClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  totalValue: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  onDeletecontractClick: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  openTaskDialog: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  openOcurrenceDialog: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  openProductViewDialog: EventEmitter<number> = new EventEmitter<number>();

  public contract: Contract[] = [];

  public columns = [
    {
      slug: "contract_number",
      order: true,
      title: "Número",
      align: "justify-content-center",
    },
    {
      slug: "contracting_body",
      order: true,
      title: "Órgão",
      align: "justify-content-center",
    },
    {
      slug: "contract_dates",
      order: true,
      title: "Vigência",
      align: "justify-content-center",
    },
    {
      slug: "total_value",
      order: true,
      title: "Valor",
      align: "justify-content-center",
    },
    {
      slug: "outstanding_balance",
      order: true,
      title: "Saldo",
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
    private readonly contractService: ContractService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {filters, searchTerm, loading} = changes;

    if (loading?.currentValue) {
      this._onSearch();
    }

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

  private _setLoading(state: boolean): void {
    this.loading = state;
  }

  private _onSearch() {
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    this._setLoading(true); // Ativa o loading antes de iniciar a requisição

    console.log(this.filters);

    this.contractService
      .searchContracts(this.pageControl, this.filters)
      .pipe(finalize(() => this._setLoading(false))) // Garante que o loading será desativado após a requisição
      .subscribe((res) => {
        this.contract = res.data;
        const result: any = res;
        this.totalValue.emit(
          (result.data as Contract[]).reduce((sum, c) => sum + (+c.total_contract_value || 0), 0)
        );
        this.pageControl.page = res.current_page - 1;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
      });
  }


  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }
}
