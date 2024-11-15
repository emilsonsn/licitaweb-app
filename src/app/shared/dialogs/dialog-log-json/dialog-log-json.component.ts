import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-log-json',
  templateUrl: './dialog-log-json.component.html',
  styleUrls: ['./dialog-log-json.component.scss']
})
export class DialogLogJsonComponent {
  config: any;
  value: string;

  constructor(
    public dialogRef: MatDialogRef<DialogLogJsonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.config = {
      mode: 'json',
      theme: 'github',
      wrap: true,
      tabSize: 4,
      showPrintMargin: false,
      fontSize: 18
    };

    // Formatando JSON
    this.value = JSON.stringify(JSON.parse(data), null, 4);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
