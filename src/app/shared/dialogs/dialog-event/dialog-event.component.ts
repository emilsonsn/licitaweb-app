import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EventStatus, IEventTask} from "@models/Event";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {Tender} from "@models/tender";
import {TenderService} from "@services/tender.service";
import {debounceTime, finalize, Subject} from "rxjs";
import {Order, PageControl} from "@models/application";
import dayjs from "dayjs";

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

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  constructor(
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IEventTask,
    private fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _tenderService: TenderService,
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
      user_id: [data.user_id || null]
    });
    this.getUsers();
    this._onSearch();

    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this._onSearch();
    });

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
      this.dialogRef.close({action, event: form.value});
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

  protected readonly EventStatus = EventStatus;
}
