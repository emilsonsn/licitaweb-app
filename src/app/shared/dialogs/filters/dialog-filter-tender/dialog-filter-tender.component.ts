import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Modality } from '@models/modality';
import { StatusLicitaWeb } from '@models/statusLicitaWeb';
import { User } from '@models/user';
import { ModalityService } from '@services/modality.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-dialog-filter-tender',
  templateUrl: './dialog-filter-tender.component.html',
  styleUrl: './dialog-filter-tender.component.scss'
})

export class DialogFilterTenderComponent {
  protected form : FormGroup;

  protected filterStatus: string[] = Object.values(StatusLicitaWeb);
  protected readonly StatusLicitaWeb = StatusLicitaWeb;
  public modalities: Modality[];
  public users: User[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly dialogRef: MatDialogRef<DialogFilterTenderComponent>,
    private readonly _fb : FormBuilder,
    private _user: UserService,
    private _modalityService: ModalityService,

  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      order: [''],
      start_contest_date: [''],
      end_contest_date: [''],
      modality_id: [''],
      status: new FormControl([]),
      user_id: [''],
    });

    if(this._data) {
      this.form.patchValue(this._data);
    }

    this.getUsers();
    this.getModalities();
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
    if(!this.form.valid) return;

    this.dialogRef.close({
      clear : false,
      filters : {
        ...this.form.getRawValue(),
      }
    });
  }

  public onCancel(clear? : boolean): void {
    if(clear)
      this.dialogRef.close({ 'clear' : true });
    else
      this.dialogRef.close();
  }

  // Utils
  public resetStatusSelection() {
    this.status.reset();
  }

  // Getters
  public get status() {
    return this.form.get('status') as FormControl;
  }
}
