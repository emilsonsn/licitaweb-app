import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TenderService } from '@services/tender.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialogs-notification',
  templateUrl: './dialogs-notification.component.html',
  styleUrls: ['./dialogs-notification.component.scss']
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
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.getTenderes();

    let hora = dayjs().format('HH:mm');
    let data = dayjs().format('YYYY-MM-DD');

    this.form = this.fb.group({
      description: ['', Validators.required],
      message: ['', Validators.required],
      date: [data, Validators.required],
      time: [hora, Validators.required],
      tender_id: ['', Validators.required]
    });

    if (this.data) {
      this.isNewNotification = false;
      const adjustedDate = dayjs(this.data.datetime).toDate();
      const formattedTime = dayjs(this.data.datetime).format('HH:mm');

      this.form.patchValue({
        ...this.data,
        date: adjustedDate,
        time: formattedTime
      });
    }
  }

  getTenderes() {
    this._tenderService.all().subscribe(res => {
      this.tenderes = res.data;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { date, time, description, message, tender_id } = this.form.value;
    const datetime = this.combineDateAndTime(date, time);

    const formData = new FormData();
    formData.append('description', description);
    formData.append('message', message);
    formData.append('datetime', datetime);
    formData.append('tender_id', tender_id);

    this.dialogRef.close(formData);
  }

  combineDateAndTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date); // Cria um novo objeto Date a partir da data
    combined.setHours(hours, minutes); // Define a hora e minuto

    // Formata para o formato 'YYYY-MM-DD HH:mm:ss' esperado
    return dayjs(combined).format('YYYY-MM-DD HH:mm:00');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
