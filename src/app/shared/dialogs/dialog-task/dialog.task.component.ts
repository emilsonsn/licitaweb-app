import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { TaskStatusEnum } from '@models/Task';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import dayjs from 'dayjs';
import {EventStatus} from "@models/Event";

@Component({
  selector: 'app-dialog-task',
  templateUrl: './dialog.task.component.html',
  styleUrls: ['./dialog.task.component.scss']
})
export class DialogTaskComponent {
  form: FormGroup;
  public users: User[];

  statusData= Object.values(EventStatus);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogTaskComponent>,
    private readonly _userService : UserService,
    @Inject(MAT_DIALOG_DATA)
    public data: {id: number}
  ) {}

  ngOnInit(): void {
    this.getUsers();

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [''],
      due_date: ['', Validators.required],
      user_id: ['', Validators.required],
      tender_id: ['', Validators.required]
    });

    this.form.patchValue({tender_id : this.data.id});
  }

  public getUsers() {
    this._userService.getUsers()
      .subscribe((user) => {
        this.users = user.data;
      });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.form.getRawValue(),
      due_date: dayjs(this.form.get('due_date')?.value).format('YYYY-MM-DD')
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  protected readonly EventStatus = EventStatus;
}
