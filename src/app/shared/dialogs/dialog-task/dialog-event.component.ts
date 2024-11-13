import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IEventTask} from "@models/Event";

@Component({
  selector: 'app-dialog-task',
  templateUrl: './dialog-event.component.html',
  styleUrl: './dialog-event.component.scss'
})
export class DialogEventComponent {
  eventForm: FormGroup;
  isEditMode: boolean;
  statusOptions = ['Pending', 'InProgress', 'Completed'];

  constructor(
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IEventTask,
    private fb: FormBuilder
  ) {
    this.isEditMode = !!data.name;
    this.eventForm = this.fb.group({
      id: [data.id || null],
      name: [data.name || '', Validators.required],
      due_date: [data.due_date || '', Validators.required],
      description: [data.description || ''],
      status: [data.status || 'Pending'],
      tender_id: [data.tender_id || null, Validators.required],
      user_id: [data.user_id || null]
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
}
