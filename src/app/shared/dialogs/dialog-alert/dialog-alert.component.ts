import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrl: './dialog-alert.component.scss'
})
export class DialogAlertComponent {
  title: string = 'Aviso Importante!';
  constructor(public dialog: MatDialog) {}

  openAlertDialog() {
    this.dialog.open(DialogAlertComponent);
  }

  onCancel() {
    this.dialog.closeAll();
  }
}
