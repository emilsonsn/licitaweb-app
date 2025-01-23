import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@models/user';
import { FiltersService } from '@services/filters-service.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-dialog-filter-supplier',
  templateUrl: './dialog-filter-supplier.component.html',
  styleUrl: './dialog-filter-supplier.component.scss'
})
export class DialogFilterSupplierComponent {
  protected form: FormGroup;
  public users: User[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly dialogRef: MatDialogRef<DialogFilterSupplierComponent>,
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
  }

  public getUsers() {
    this._user.getUsers()
      .subscribe((user) => {
        this.users = user.data;
      });
  }

  public onConfirm(): void {
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

}
