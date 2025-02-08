import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-historical-product',
  templateUrl: './dialog-historical-product.component.html',
  styleUrl: './dialog-historical-product.component.scss'
})
export class DialogHistoricalProductComponent {
  public title: string = 'Historico de custo';

  public loading: boolean = false;
  public filters;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly id: number,
    private readonly _dialogRef: MatDialogRef<DialogHistoricalProductComponent>,
  ) { }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close();
  }
}
