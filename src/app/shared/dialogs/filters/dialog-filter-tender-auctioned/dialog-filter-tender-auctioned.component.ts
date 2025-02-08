import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Modality} from "@models/modality";
import {User} from "@models/user";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "@services/user.service";
import {ModalityService} from "@services/modality.service";
import {FiltersService} from "@services/filters-service.service";
import {TaskService} from "@services/task.service";

@Component({
  selector: 'app-dialog-filter-tender-auctioned',
  templateUrl: './dialog-filter-tender-auctioned.component.html',
  styleUrl: './dialog-filter-tender-auctioned.component.scss'
})
export class DialogFilterTenderAuctionedComponent {
  protected form: FormGroup;
  public modalities: Modality[];
  public users: User[];
  public Status: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly dialogRef: MatDialogRef<DialogFilterTenderAuctionedComponent>,
    private readonly _fb: FormBuilder,
    private _user: UserService,
    private _modalityService: ModalityService,
    private filtersService: FiltersService,
    private _taskService: TaskService
  ) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      organ: [''],
      start_contest_date: [''],
      end_contest_date: [''],
      modality_id: [''],
      status_id: [''],
      status: new FormControl([]),
      user_id: [''],
    });

    if (this._data) {
      this.form.patchValue(this._data);
    }

    this.getUsers();
    this.getModalities();
    this.getStatus();

    const savedFilters = this.filtersService.getFilters('Tender');
    if (savedFilters) {
      this.form.patchValue(savedFilters);
    }
  }

  public getStatus() {
    this._taskService.getStatusTasks()
      .subscribe({
        next: (status) => {
          this.form.get('status_id').patchValue(status.data.find(x => x.name === "Arrematado").id);
        },
        error: (err) => {
          console.error(err);
        }
      })
  }

  public getUsers() {
    this._user.getUsers()
      .subscribe((user) => {
        this.users = user.data;
      });
  }

  public getModalities() {
    this._modalityService.getModalities()
      .subscribe((modalities) => {
        this.modalities = modalities.data;
      });
  }

  public onConfirm(): void {
    this.filtersService.setFilters(this.form.value, 'Tender');
    if (!this.form.valid) return;

    this.dialogRef.close({
      clear: false,
      filters: {
        ...this.form.getRawValue(),
      }
    });
  }

  public onCancel(clear?: boolean): void {
    if (clear) {
      this.dialogRef.close({'clear': true});
      this.filtersService.setFilters(null, 'Tender');
    } else
      this.dialogRef.close();
  }

  // Utils
  public resetStatusSelection() {
    this.status.patchValue('');
  }

  // Getters
  public get status() {
    return this.form.get('status') as FormControl;
  }
}
