import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Modality } from '@models/modality';
import { ModalityService } from '@services/modality.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogModalityComponent } from '@shared/dialogs/dialog-modality/dialog-modality.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-modality',
  templateUrl: './modality.component.html',
  styleUrl: './modality.component.scss'
})
export class ModalityComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _modality: ModalityService,
  ) {}

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogModality(modality?: Modality) {
    this._dialog
      .open(DialogModalityComponent, {
        data: { modality },
        width: '80%',
        maxWidth: '650px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.id) {
            this._patchModality(res);
            return;
          }
          this._postModality(res);
        }
      });
  }

  onDeleteModality(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, {data: {text}})
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteCollaborator(id);
        }
      });
  }

  _deleteCollaborator(id: number) {
    this._initOrStopLoading();
    this._modality
      .deleteModality(id)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _postModality(modality: Modality) {
    this._initOrStopLoading();
    this._modality
      .postModality(modality)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _patchModality(modality: FormData) {
    this._initOrStopLoading();
    const id = +modality.get('id');
    this._modality
      .patchModality(id, modality)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

}
