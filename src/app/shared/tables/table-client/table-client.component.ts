import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Order, PageControl} from '@models/application';
import {Client} from '@models/client';
import {ClientService} from '@services/client.service';
import {UserService} from '@services/user.service';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import {DialogClientLogComponent} from "@shared/dialogs/dialog-client-log/dialog-client-log.component";

@Component({
  selector: 'app-table-client',
  templateUrl: './table-client.component.html',
  styleUrl: './table-client.component.scss'
})
export class TableClientComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onClientClick: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onDeleteClientClick: EventEmitter<number> =
    new EventEmitter<number>();

  @Output()
  openOcurrenceDialog: EventEmitter<number> = new EventEmitter<number>();

  public clients: Client[] = [];

  public columns = [
    {
      slug: "name",
      order: true,
      title: "Nome/Razão Social",
      align: "start",
    },
    {
      slug: "cnpj",
      order: true,
      title: "CPF/CNPJ",
      align: "justify-content-center",
    },
    {
      slug: "whatsapp",
      order: true,
      title: "Telefone/Whatsapp",
      align: "justify-content-center",
    },
    {
      slug: "email",
      order: true,
      title: "Email",
      align: "justify-content-center",
    },
    {
      slug: "Cidade/Estado",
      order: true,
      title: "Cidade/Estado",
      align: "justify-content-center",
    },
    {
      slug: "flag",
      order: true,
      title: "Bandeira",
      align: "justify-content-center",
    },
    {
      slug: "user",
      order: true,
      title: "Responsável Interno",
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
    private readonly _clientService: ClientService,
    private _userService: UserService,
    private dialog: MatDialog
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
    this._clientService
      .getClients(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: res => {
          this.clients = res.data;

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

  openWhatsapp(whatsapp: number | undefined) {
    if (whatsapp) {
      window.open(`https://api.whatsapp.com/send?phone=55${whatsapp}`);
    } else {
      this._toastr.warning("Nenhum telefone cadastrado");
    }
  }

  openEmail(email: string | undefined) {
    if (email) {
      window.open(`mailto:${email}`);
    }else {
      this._toastr.warning("Nenhum email cadastrado");
    }
  }

  openLogsClient(id: number | undefined, nameClient: string | undefined) {
    this.dialog.open(DialogClientLogComponent, {
      data: {clientId: id, nameClient: nameClient}
    });
  }
}


