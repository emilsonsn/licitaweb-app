import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  DialogCommitmentNotesComponent
} from "@shared/dialogs/dialog-commitment-notes/dialog-commitment-notes.component";
import {DialogAlertComponent} from "@shared/dialogs/dialog-alert/dialog-alert.component";

@Component({
  selector: 'app-commitment-notes',
  templateUrl: './commitment-notes.component.html',
  styleUrl: './commitment-notes.component.scss'
})
export class CommitmentNotesComponent {
  constructor(private dialog: MatDialog) {
    this.openAlertDialog();
  }

  openModal() {
    this.dialog.open(DialogCommitmentNotesComponent, {
      width: '500px'
    });
  }

  openAlertDialog() {
    this.dialog.open(DialogAlertComponent, {
      width: '500px'  // Define a largura do diálogo
    });
  }

}
