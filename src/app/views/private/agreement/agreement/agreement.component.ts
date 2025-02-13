import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {DialogContractComponent} from "@shared/dialogs/dialog-contract/dialog-contract.component";

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrl: './agreement.component.scss'
})
export class AgreementComponent {
  public loading: boolean = false;
  public totalValue: number;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,

  ) {

  }

  openDialogContract() {
    const dialogRef = this._dialog.open(DialogContractComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Contrato criado:', result);
      }
    });
  }
}
