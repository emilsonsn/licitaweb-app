import { Component, Inject } from '@angular/core';
import { ContractService } from '@services/contract.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '@services/client.service';
import { Client } from '@models/client';
import { Order, PageControl } from '@models/application';
import { debounceTime, map, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ContractStatusEnum } from '@shared/enums/ContractStatusEnum';
import dayjs from 'dayjs';
import { TenderService } from '@services/tender.service';
import { Tender } from '@models/tender';
import { ToastrService } from 'ngx-toastr';
import { FileInput } from '@shared/components/file/file-input/file-input.component';
import { FileReceive } from '@shared/components/file/file-receive/file-receive.component';
import {
  Contract,
  ContractKeys,
  ContractPaymentCondtion,
} from '@models/contract';

@Component({
  selector: 'app-dialog-contract',
  templateUrl: './dialog-contract.component.html',
  styleUrl: './dialog-contract.component.scss',
})
export class DialogContractComponent {
  // Form
  protected contractForm: FormGroup;
  protected title: string = 'Novo contrato';
  protected isNewContract: boolean = true;

  // Utils
  protected _onDestroy = new Subject<void>();
  protected loading: boolean = false;

  // Completes
  protected ALL_CLIENTS: Client[] = [];
  protected clientsCtrl: FormControl<Client> = new FormControl<Client>(null);
  protected clientsFilterCtrl: FormControl<string> = new FormControl<string>(
    ''
  );
  protected filteredClients: ReplaySubject<Client[]> = new ReplaySubject<
    Client[]
  >();

  protected ALL_TENDERS: Tender[] = [];
  protected tendersCtrl: FormControl<Tender> = new FormControl<Tender>(null);
  protected tendersFilterCtrl: FormControl<string> = new FormControl<string>(
    ''
  );
  protected filteredTenders: ReplaySubject<Tender[]> = new ReplaySubject<
    Tender[]
  >();

  protected contractPaymentEnum = Object.values(ContractPaymentCondtion);
  protected statusOptions = Object.values(ContractStatusEnum);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Contract,
    private readonly _dialogRef: MatDialogRef<DialogContractComponent>,
    private readonly _fb: FormBuilder,
    private readonly _contractService: ContractService,
    private readonly _clientService: ClientService,
    private readonly _tenderService: TenderService,
    private readonly _toastr: ToastrService
  ) {
    this.contractForm = this._fb.group({
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
      outstanding_balance: [
        this.data?.outstanding_balance,
        [Validators.min(0)],
      ],
      payment_conditions: [ContractPaymentCondtion.CASH, [Validators.required]],
      observations: [''],
      products: this._fb.array([]),
      attachments: [null],
    });

    this._clientService.getClients().subscribe((res) => {
      this.ALL_CLIENTS = res.data;
      this.filteredClients.next(res.data);
      this.prepareFilterClientCtrl();
    });

    this._tenderService.getTenders().subscribe((res) => {
      this.ALL_TENDERS = res.data;
      this.filteredTenders.next(res.data);
      this.prepareFilterTendersCtrl();
    });

    if (data) {
      this.isNewContract = false;
      this.title = 'Editar contrato';
      this.contractForm.reset(data);
      this.filesReceived = this.data.attachments;
    }
  }

  protected onSubmit(): void {
    if (!this.contractForm.valid) {
      this._toastr.warning('Formulário inválido!');
      return;
    }

    if (this.loading) {
      this._toastr.info('Carregando...');
      return;
    }

    const formData = this.prepareFormData(this.contractForm);

    if (!this.isNewContract) this.update(this.data.id, formData);
    else this.create(formData);
  }

  protected create(contract: FormData) {
    this._contractService.createContract(contract).subscribe({
      next: (res) => {
        this._toastr.success('Contrato criado com sucesso!');
        this._dialogRef.close(res);
      },
      error: (err) => {
        this._toastr.error('Erro ao criar contrato!', err.error.message);
      },
    });
  }

  protected update(id: number, contract: FormData) {
    this._contractService.updateContract(id, contract).subscribe({
      next: (res) => {
        this._toastr.success('Contrato atualizado com sucesso!');
        this.deleteAttachmentsFromBack();
        this._dialogRef.close(res);
      },
      error: (err) => {
        this._toastr.error('Erro ao atualizar contrato', err.error.message);
      },
    });
  }

  protected deleteAttachmentsFromBack() {
    this.filesIdsToDeleteFromBack.map((id) => {
      this._contractService.deleteAttachment(id).subscribe();
    });
  }

  protected prepareFormData(form: FormGroup) {
    const formData = new FormData();

    const customAppends: ContractKeys[] = [
      'attachments',
      'signature_date',
      'start_date',
      'end_date',
    ];

    Object.entries(form.controls).forEach(([key, control]) => {
      if (!customAppends.includes(key as ContractKeys)) {
        formData.append(key, control.value);
      }
    });

    formData.append(
      'signature_date',
      dayjs(this.contractForm.get('signature_date')?.value).format('YYYY-MM-DD')
    );
    formData.append(
      'start_date',
      dayjs(this.contractForm.get('start_date')?.value).format('YYYY-MM-DD')
    );
    formData.append(
      'end_date',
      dayjs(this.contractForm.get('end_date')?.value).format('YYYY-MM-DD')
    );

    this.filesToSend.map((file, index) => {
      formData.append(`attachments[${index}]`, file.file);
    });

    return formData;
  }

  // Files
  protected filesToSend: FileInput[] = [];
  protected filesReceived: FileReceive[] = [];
  protected filesIdsToDeleteFromBack: number[] = [];

  protected addFile(file: FileInput) {
    this.filesToSend.push(file);
  }

  protected removeFile(data: { file: FileInput; index: number }) {
    this.filesToSend.splice(data.index, 1);
  }

  protected removeFileFromBack(file: FileReceive) {
    this.filesIdsToDeleteFromBack.push(file.id);
  }

  // Products
  productList = [
    { name: 'Produto A', unit_price: 1 },
    { name: 'Produto B', unit_price: 1 },
    { name: 'Produto C', unit_price: 1 },
  ];

  protected addProduct() {
    const product = this._fb.group({
      name: ['', Validators.required],
      unit_price: [{ value: 0, disabled: true}, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
    this.products.push(product);
  }

  protected removeProduct(index: number) {
    this.products.removeAt(index);
  }

  // Utils
  protected onCancel(): void {
    this._dialogRef.close();
  }

  protected toggleLoading() {
    this.loading = !this.loading;
  }

  protected get products(): FormArray {
    return this.contractForm.get('products') as FormArray;
  }

  // Filters
  protected prepareFilterClientCtrl() {
    this.clientsFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.ALL_CLIENTS.slice();
          } else {
            search = search.toLowerCase();
            return this.ALL_CLIENTS.filter((client) =>
              client.name?.toString().toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredClients.next(filtered);
      });
  }

  protected prepareFilterTendersCtrl() {
    this.tendersFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.ALL_TENDERS.slice();
          } else {
            search = search.toLowerCase();
            return this.ALL_TENDERS.filter(
              (tender) =>
                tender.number?.toString().toLowerCase().includes(search) ||
                tender.organ?.toString().toLowerCase().includes(search) ||
                tender.status?.name?.toString().toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredTenders.next(filtered);
      });
  }
}
