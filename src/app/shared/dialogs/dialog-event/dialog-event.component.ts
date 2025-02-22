import {Component, Inject} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ɵFormGroupRawValue,
  ɵGetProperty,
  ɵTypedOrUntyped
} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {EventStatus, IEventTask} from "@models/Event";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {Tender} from "@models/tender";
import {TenderService} from "@services/tender.service";
import {debounceTime, finalize, Subject} from "rxjs";
import {Order, PageControl} from "@models/application";
import dayjs from "dayjs";
import {DialogNoticesComponent} from "@shared/dialogs/dialog-notices/dialog-notices.component";
import {ToastrService} from "ngx-toastr";
import {Client} from "@models/client";
import {ClientService} from "@services/client.service";

@Component({
  selector: 'app-dialog-event',
  templateUrl: './dialog-event.component.html',
  styleUrl: './dialog-event.component.scss'
})
export class DialogEventComponent {
  eventForm: FormGroup;
  isEditMode: boolean;
  statusOptions = Object.values(EventStatus);
  public users: User[];
  public tenders: Tender[];
  searchTerm?: string = '';
  filters: any;
  private searchSubject = new Subject<string>();
  public search_term_client: FormControl<string> = new FormControl<string>('');
  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };
  clients: Client[] = [];
  private searchSubjectClient: Subject<string> = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IEventTask,
    private fb: FormBuilder,
    private clientService: ClientService,
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService,
    private readonly _tenderService: TenderService,
    private readonly _toastr: ToastrService,
  ) {
    this.isEditMode = !!data.name;
    const adjustedDate = dayjs(this.data.due_date).toDate();

    this.eventForm = this.fb.group({
      id: [data.id || null],
      name: [data.name || '', Validators.required],
      due_date: [adjustedDate || '', Validators.required],
      description: [data.description || ''],
      status: [data.status || 'Pending'],
      tender_id: [data.tender_id || null, Validators.required],
      user_id: [data.user_id || null],
      client_id: [data.client_id || null],
    });
    this.getUsers();
    this._onSearch();

    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this._onSearch();
    });

    clientService.getClients(this.pageControl, this.filtersClient).subscribe(res => {
      this.clients = res.data;
    });

    this.searchSubjectClient.pipe(
      debounceTime(500)
    ).subscribe(searchTerm => {
      this.onSearchClientTermChange(searchTerm);
    });

  }

  onSearchClientTermChangeDebounced(searchTerm: string): void {
    this.searchSubjectClient.next(searchTerm);
  }

  public getUsers() {
    this._userService.getUsers()
      .subscribe((user) => {
        this.users = user.data;
      });
  }

  onSearchChange(event: Event): void {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    this.search();
  }

  public openTenderDialog(value: ɵGetProperty<ɵTypedOrUntyped<any, ɵFormGroupRawValue<any>, any>, "tender_id"> | undefined) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    const data = this.eventForm.get('tender_id')?.value

    const tender = this._tenderService.getTenderById(value).subscribe(
      (res) => {
        if (res.status) {
          this._dialog
            .open(DialogNoticesComponent, {
              ...dialogConfig,
              data: data ? {...res.data} : null,
            })
            .afterClosed()
            .subscribe({
              next: (res) => {
                if (res) {
                  const id = res.get('id');
                  if (id) this.tenderPatch(id, res);
                  // else this.tenderStore(res);
                }
              }
            })
        }
      }
    );


  }

  private tenderPatch(id, tender) {
    this._tenderService.patchTender(id, tender)
      .pipe(finalize(() => {

      }))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  search(): void {
    this._tenderService
      .getTenders(this.pageControl, this.filters)
      .pipe(finalize(() => { /* Finalize callback */
      }))
      .subscribe((res) => {
        this.tenders = res.data;
        this.pageControl.page = res.current_page - 1;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
      });
  }


  save(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      const action = this.isEditMode ? 'edit' : 'add';
      this.dialogRef.close({
        action,
        event:
          {
            ...form.getRawValue(),
            due_date: form.get('due_date').value ? dayjs(form.get('due_date').value).format("YYYY-MM-DD") : ''
          }
      });
    }

  }

  delete(): void {
    this.dialogRef.close({action: 'delete', event: this.eventForm.value});
  }

  cancel(): void {
    this.dialogRef.close();
  }

  clearSearch(inputElement: HTMLInputElement): void {
    this.searchTerm = '';
    inputElement.value = '';
    this._onSearch();
  }

  applyDateMask(event: any): void {
    let value = event.target.value;

    // Remove qualquer coisa que não seja número
    // value = value.replace(/\D/g, '');


    // Adiciona a máscara 'dd/MM/yyyy' conforme o valor do input
    if (value.length <= 2) {
      value = value.replace(/(\d{2})(\d{1,})/, '$1/$2');
    }
    // Second condition: format as MM/DD/
    else if (value.length <= 4) {
      value = value.replace(/(\d{2})(\d{2})(\d{0,})/, '$1/$2/');
    }
    // Third condition: format as MM/DD/YYYY
    else {
      value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{0,})/, '$1/$2/$3');
    }

    // Atualiza o valor do input
    event.target.value = value;
  }

  filtersClient: { search_term?: string } = {search_term: ''};

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

  protected readonly EventStatus = EventStatus;
}
