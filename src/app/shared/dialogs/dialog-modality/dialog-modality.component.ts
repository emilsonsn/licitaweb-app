import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Modality } from '@models/modality';
import { Supplier } from '@models/supplier';

@Component({
  selector: 'app-dialog-modality',
  templateUrl: './dialog-modality.component.html',
  styleUrl: './dialog-modality.component.scss'
})
export class DialogModalityComponent {
  public isNewModality: boolean = true;
  public title: string = 'Nova Modalidade';
  public form: FormGroup;
  public providerTypeEnum;
  public loading : boolean = false;


  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { modality: Modality},
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _dialogRef: MatDialogRef<DialogModalityComponent>,

  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null],
      name: ['', [Validators.required]],
    });

    if (this._data?.modality) {
      this.isNewModality = false;
      this.title = 'Editar Modalidade';
      this._fillForm(this._data.modality);
    }
  }

  private _fillForm(modality: Modality): void {
    this.form.patchValue(modality);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append('id', form.get('id')?.value);
      formData.append('name', form.get('name')?.value);

      this._dialogRef.close(formData)
    }
  }
}
