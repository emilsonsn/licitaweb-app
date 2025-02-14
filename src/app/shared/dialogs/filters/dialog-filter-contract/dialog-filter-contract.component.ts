import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ContractStatusEnum} from "@shared/enums/ContractStatusEnum";
import {debounceTime, Subject} from "rxjs";
import {TenderService} from "@services/tender.service";
import {Tender} from "@models/tender";
import {Order, PageControl} from "@models/application";
import {ClientService} from "@services/client.service";
import {Client} from "@models/client";
import dayjs from "dayjs";

@Component({
  selector: 'app-dialog-filter-contract',
  templateUrl: './dialog-filter-contract.component.html',
  styleUrl: './dialog-filter-contract.component.scss'
})
export class DialogFilterContractComponent {
  filterForm: FormGroup;
  statusOptions = Object.values(ContractStatusEnum);
  tenders: Tender[] = [];
  public search_term_client: FormControl<string> = new FormControl<string>('');
  private searchSubjectTender: Subject<string> = new Subject<string>();
  filtersTender: { search_term?: string } = {search_term: ''};
  pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  clients: Client[] = [];
  private searchSubjectClient: Subject<string> = new Subject<string>();
  filtersClient: { search_term?: string } = {search_term: ''};

  constructor(
    private fb: FormBuilder,
    private tenderService: TenderService,
    private clientService: ClientService,
    public dialogRef: MatDialogRef<DialogFilterContractComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      client_id: [null],
      tender_id: [null],
      start_date: [''],
      end_date: [''],
      status: [''],
      search_term: [''],
    });

    tenderService.getTenders(this.pageControl, this.filtersTender).subscribe(res => {
      this.tenders = res.data;
    });

    clientService.getClients(this.pageControl, this.filtersClient).subscribe(res => {
      this.clients = res.data;
    });


    this.searchSubjectTender.pipe(
      debounceTime(500)
    ).subscribe(searchTerm => {
      this.onSearchTenderTermChange(searchTerm);
    });

    this.searchSubjectClient.pipe(
      debounceTime(500)
    ).subscribe(searchTerm => {
      this.onSearchClientTermChange(searchTerm);
    });

    if (this.data) {
      console.log(this.data);
      this.filterForm.patchValue(this.data);
    }

  }

  applyFilters(): void {

    const formData = {...this.filterForm.value};

    if (formData.start_date) {
      formData.start_date = dayjs(formData.start_date).format('YYYY-MM-DD');
    }
    if (formData.end_date) {
      formData.end_date = dayjs(formData.end_date).format('YYYY-MM-DD');
    }

    const filters = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );

    this.dialogRef.close(filters);
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSearchTenderTermChangeDebounced(searchTerm: string): void {
    this.searchSubjectTender.next(searchTerm);
  }

  onSearchTenderTermChange(searchTerm: string): void {
    this.filtersTender.search_term = searchTerm;

    this.pageControl.page = 1;

    this.tenderService.getTenders(this.pageControl, this.filtersTender).subscribe(
      (res) => {
        this.tenders = res.data;
      },
      (error) => {
        console.error('Erro ao buscar tenders:', error);
      }
    );
  }

  onSearchClientTermChangeDebounced(searchTerm: string): void {
    this.searchSubjectClient.next(searchTerm);
  }

  onSearchClientTermChange(searchTerm: string): void {
    this.filtersClient.search_term = searchTerm;

    this.pageControl.page = 1;

    this.clientService.getClients(this.pageControl, this.filtersClient).subscribe(
      (res) => {
        this.clients = res.data;
      },
      (error) => {
        console.error('Erro ao buscar clientes:', error);
      }
    );
  }
}
