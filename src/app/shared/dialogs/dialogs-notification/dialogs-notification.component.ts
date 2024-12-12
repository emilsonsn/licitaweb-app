import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TenderService } from '@services/tender.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialogs-notification',
  templateUrl: './dialogs-notification.component.html',
  styleUrl: './dialogs-notification.component.scss'
})
export class DialogsNotificationComponent {
  public form: FormGroup;
  public tenderes = [];
  public isNewNotification: boolean = true;

  constructor(
    private readonly _toastr: ToastrService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogsNotificationComponent>,
    private readonly _tenderService: TenderService,
    @Inject(MAT_DIALOG_DATA)
    public data
  ){ }


  ngOnInit(): void {
    this.getTenderes()

    this.form = this.fb.group({
      description: ['', Validators.required],
      message: ['', Validators.required],
      datetime: ['', Validators.required, this.dateTimeValidator],
      tender_id: [''],
    });

    if (this.data) {
      this.isNewNotification = false;
      const adjustedDate = dayjs(this.data.datetime).toDate();

      this.form.patchValue({
        ...this.data,
        datetime: adjustedDate
      });
    }

  }

  onInputChange() {
    const input = this.form.get('datetime');
    if (input && input.value) {
      // Aqui você pode formatar a entrada conforme necessário
      const formattedValue = this.formatInput(input.value);
      input.setValue(formattedValue, { emitEvent: false });
    }
  }
  formatInput(value: string): string {
    // Remove caracteres não numéricos
    const cleaned = value.replace(/\D/g, '');

    // Formata como DD/MM/YYYY HH:MM:SS
    let formatted = '';
    if (cleaned.length >= 8) {
      formatted += cleaned.substring(0, 2) + '/'; // DD
      formatted += cleaned.substring(2, 4) + '/'; // MM
      formatted += cleaned.substring(4, 8);        // YYYY
      if (cleaned.length >= 10) {
        formatted += ' ' + cleaned.substring(8, 10); // HH
        if (cleaned.length >= 12) {
          formatted += ':' + cleaned.substring(10, 12); // MM
          if (cleaned.length >= 14) {
            formatted += ':' + cleaned.substring(12, 14); // SS
          }
        }
      }
    } else if (cleaned.length > 0) {
      formatted = cleaned; // Se não atingir o tamanho mínimo, apenas exibe os números
    }

    return formatted;
  }

  dateTimeValidator(control) {
    const value = control.value;
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})\s([01][0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(value) ? null : { invalidDateTime: true };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTenderes(){
    this._tenderService.all().subscribe(res => {
      this.tenderes = res.data;
    });
  }

  onSubmit(form) {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      const formData = new FormData();

      formData.append('id', form.get('id')?.value ?? '');
      formData.append('description', form.get('description')?.value ?? '');
      formData.append('message', form.get('message')?.value);
      formData.append('datetime', dayjs(form.get('datetime')?.value).format('YYYY-MM-DD'));
      formData.append('tender_id', form.get('tender_id')?.value);

      this.dialogRef.close(formData);
    }
  }
}
