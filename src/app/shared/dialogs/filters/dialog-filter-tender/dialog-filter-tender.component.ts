import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StatusLicitaWeb } from '@models/statusLicitaWeb';

@Component({
  selector: 'app-dialog-filter-tender',
  templateUrl: './dialog-filter-tender.component.html',
  styleUrl: './dialog-filter-tender.component.scss'
})
export class DialogFilterTenderComponent {
  protected form : FormGroup;

  protected filterStatus: string[] = Object.values(StatusLicitaWeb);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly dialogRef: MatDialogRef<DialogFilterTenderComponent>,
    private readonly _fb : FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      issuingAgency: [''],
      modalty: [''],
      status: new FormControl([]),
      internalResponsible: [''],
    });

    if(this._data) {
      this.form.patchValue(this._data);
    }
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
