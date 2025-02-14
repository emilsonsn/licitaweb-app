import {Component, Inject} from '@angular/core';
import {ContractService} from "@services/contract.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ClientService} from "@services/client.service";
import {Client} from "@models/client";
import {Order, PageControl} from "@models/application";
import {debounceTime, Subject} from "rxjs";
import {ContractStatusEnum} from "@shared/enums/ContractStatusEnum";
import dayjs from "dayjs";
import {TenderService} from "@services/tender.service";
import {Tender} from "@models/tender";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-dialog-contract',
  templateUrl: './dialog-contract.component.html',
  styleUrl: './dialog-contract.component.scss'
})
export class DialogContractComponent {
  contractForm: FormGroup;
  title: string = 'Novo contrato';
  isNewContract: boolean = true;
  clients: Client[] = [];
  tenders: Tender[] = [];
  public search_term_client: FormControl<string> = new FormControl<string>('');
  private searchSubjectClient: Subject<string> = new Subject<string>();
  public search_term_tender: FormControl<string> = new FormControl<string>('');
  private searchSubjectTender: Subject<string> = new Subject<string>();

  pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };
  filtersTender: { search_term?: string } = {search_term: ''};
  filtersClient: { search_term?: string } = {search_term: ''};
  statusOptions = Object.values(ContractStatusEnum);

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private clientService: ClientService,
    private tenderService: TenderService,
    private readonly _toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogContractComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.contractForm = this.fb.group({
      id: [null],
      contract_number: [null, [Validators.required]],
      client_id: [null, [Validators.required]],
      tender_id: [null, [Validators.required]],
      contract_object: ['', [Validators.required]],
      signature_date: [this.data?.signature_date || null],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      status: ['', [Validators.required]],
      total_contract_value: [null, [Validators.required, Validators.min(0)]],
      payment_conditions: ['', [Validators.required]],
      observations: [''],
      attachments: [''],
    });

    clientService.getClients(this.pageControl, this.filtersClient).subscribe(res => {
      this.clients = res.data;
    });

    tenderService.getTenders(this.pageControl, this.filtersTender).subscribe(res => {
      this.tenders = res.data;
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

    if (data) {
      this.isNewContract = false;
      this.title = 'Editar contrato';
      this.contractForm.patchValue(data);
    }

  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(form: FormGroup): void {
    if (form.invalid) {
      return;
    }

    const formData = {...form.value};

    if (formData.signature_date) {
      formData.signature_date = dayjs(formData.signature_date).format('YYYY-MM-DD');
    }
    if (formData.start_date) {
      formData.start_date = dayjs(formData.start_date).format('YYYY-MM-DD');
    }
    if (formData.end_date) {
      formData.end_date = dayjs(formData.end_date).format('YYYY-MM-DD');
    }

    if (formData.id) {
      this.contractService.updateContract(formData.id, formData).subscribe(
        response => {
          console.log('Contrato atualizado com sucesso!', response);
          this._toastr.success('Contrato atualizado com sucesso!');
          this.dialogRef.close(response);
        },
        error => {
          this._toastr.error('Erro ao atualizar contrato');
          console.error('Erro ao atualizar contrato', error);
        }
      );
    } else {
      this.contractService.createContract(formData).subscribe(
        response => {
          console.log('Contrato criado com sucesso!', response);
          this._toastr.success('Contrato criado com sucesso!');
          this.dialogRef.close(response);
        },
        error => {
          this._toastr.error('Erro ao criar contrato');
          console.error('Erro ao criar contrato', error);
        }
      );
    }

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

  onSearchTenderTermChangeDebounced(searchTerm: string): void {
    this.searchSubjectTender.next(searchTerm);
  }

}
