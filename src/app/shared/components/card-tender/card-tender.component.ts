import {Component, Input} from '@angular/core';
import dayjs from "dayjs";
import {finalize} from "rxjs";
import {TenderService} from "@services/tender.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogNoticesComponent} from "@shared/dialogs/dialog-notices/dialog-notices.component";

@Component({
  selector: 'app-card-tender',
  templateUrl: './card-tender.component.html',
  styleUrl: './card-tender.component.scss'
})
export class CardTenderComponent {
  @Input() tender!: any;

  protected readonly dayjs = dayjs;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _tenderService: TenderService,
    private readonly _dialog: MatDialog,
  ) {
  }

  goToOfficialSite(origin_url) {
    window.open(origin_url, '_blank');
  }

  downloadAttachemnts(tenderId){
    this._tenderService.getAttachment(tenderId)
    .subscribe(res => {
      if(res.status){
        res.data.forEach(attachment => {
          window.open(attachment, '_blank');
        });
      }
    })
  }

  importTender(tender: any) {

    if (!tender) {
      return;
    }

    console.log(tender);

    const tenderForm = {
      external_id: tender.id,
      number: tender.number_purchase,
      organ: tender.organ_name,
      estimated_value: tender.value,
      contest_date: tender.proposal_closing_date,
      attachments: tender.attachments,
      object: tender.object,
    };

    this._tenderService.getTenders({}, {external_id: tender.id})
    .subscribe({
      next: (res) => {
        if(res.data.length) {
          this._toastr.warning("Esse edital já foi importado");
          return;
        }

        this.openTenderDialog(tenderForm);  
      },
      error: (error) => {
        this._toastr.error(error.error.data)
      } 
    });    

  }


  public openTenderDialog(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogNoticesComponent, {
        ...dialogConfig,
        data: data ? {
          ...data,
          import: true
        } : null,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            const id = res.get('id');
            if (id) this.tenderPatch(id, res);
            else this.tenderStore(res);
          }
        }
      })
  }

  private tenderPatch(id, tender) {
    this._tenderService.patchTender(id, tender)
      .pipe(finalize(() => {

      }))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  private tenderStore(tender) {
    this._tenderService.postTender(tender)
      .pipe(finalize(() => {
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Edital cadastrado com sucesso!');
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }
}
