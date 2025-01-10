import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@models/user';
import { FiltersService } from '@services/filters-service.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-dialog-filter-client',
  templateUrl: './dialog-filter-client.component.html',
  styleUrl: './dialog-filter-client.component.scss'
})
export class DialogFilterClientComponent {
  protected form: FormGroup;
  public users: User[];
  public flags = ['Verde', 'Amarelo', 'Vermelho'];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly dialogRef: MatDialogRef<DialogFilterClientComponent>,
    private readonly _fb: FormBuilder,
    private _user: UserService,
    private filtersService: FiltersService,

  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      search_term: [''],
      flag: [''],
      user_id: [''],
    });

    if (this._data) {
      this.form.patchValue(this._data);
    }

    this.getUsers();
    const savedFilters = this.filtersService.getFilters('Client');
    if (savedFilters) {
      this.form.patchValue(savedFilters);
    }
  }

  public getUsers() {
    this._user.getUsers()
      .subscribe((user) => {
        this.users = user.data;
      });
  }

  public onConfirm(): void {
    this.filtersService.setFilters(this.form.value, 'Client');
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
      this.dialogRef.close({ 'clear': true });
      this.filtersService.setFilters(null, 'Client');
    }
    else
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
