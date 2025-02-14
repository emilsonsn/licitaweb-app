import {Component} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {DialogContractComponent} from "@shared/dialogs/dialog-contract/dialog-contract.component";
import {Contract} from "@models/contract";
import {ContractService} from "@services/contract.service";
import {
  DialogFilterContractComponent
} from "@shared/dialogs/filters/dialog-filter-contract/dialog-filter-contract.component";

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrl: './agreement.component.scss'
})
export class AgreementComponent {
  public filtersFromDialog;
  public loading: boolean = false;
  public filters;
  public totalValue: number;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly contractService: ContractService,
  ) {

  }

  openDialogContract(contract?: Contract) {
    this.loading = false;
    const dialogRef = this._dialog.open(DialogContractComponent, {
      data: contract,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
      }
    });
  }

  changeTotalValue(value) {
    this.totalValue = value;
  }

  deleteContract($event: number) {
    this.loading = false;
    this.contractService.deleteContract($event).subscribe(() => {
      this.loading = true;
      this._toastr.success('Contrato deletado com sucesso!');
    }, () => {
      this._toastr.error('Erro ao deletar contrato!');
    });
  }

  openContractFilterDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogFilterContractComponent, {
        data: {...this.filters},
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.filters = {
              ...res
            };
          }
        }
      })
  }
}
