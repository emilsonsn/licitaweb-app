import {Component} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogLogJsonComponent} from "@shared/dialogs/dialog-log-json/dialog-log-json.component";
import {Log} from "@models/Log";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  public loading: boolean = false;

  constructor(public dialog: MatDialog) {
  }

  openLogDialog(someObject: any): void {

    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '500px',
      height: '90%',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this.dialog.open(DialogLogJsonComponent, {
      ...dialogConfig,
      data: someObject
    });
  }

  onLogClick($event: Log) {
    this.openLogDialog($event.request);
  }

}
