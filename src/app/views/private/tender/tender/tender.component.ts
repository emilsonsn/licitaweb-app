import {Component, computed, Signal, signal} from '@angular/core';
import {OrderData} from "@models/dashboard";
import {ISmallInformationCard} from "@models/cardInformation";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DialogNoticesComponent} from '@shared/dialogs/dialog-notices/dialog-notices.component';
import {
  DialogFilterOrderComponent,
  OrderFilters
} from '@shared/dialogs/filters/dialog-filter-order/dialog-filter-order.component';
import dayjs from 'dayjs';
import { TenderService } from '@services/tender.service';
import { ToastrService } from 'ngx-toastr';
import { DialogFilterTenderComponent } from '@shared/dialogs/filters/dialog-filter-tender/dialog-filter-tender.component';

@Component({
  selector: 'app-tender',
  templateUrl: './tender.component.html',
  styleUrl: './tender.component.scss'
})
export class TenderComponent {
  public loading: boolean = false;
  public filtersFromDialog: FormGroup;
  public filters: OrderFilters;

  dashboardCards = signal<OrderData>(
    {
      ordersByDay: 0,
      ordersByWeek: 0,
      ordersByMonth: 0,
      ordersByYear: 0,
      pendingOrders: 0,
      awaitingFinanceOrders: 0,
      solicitationPendings: 0,
      solicitationFinished: 0,
    }
  );

  itemsRequests: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-clock',
      background: '#FC9108',
      title: this.dashboardCards().pendingOrders,
      category: 'Editais',
      description: 'Editais pendentes',
    },
    {
      icon: 'fa-solid fa-envelope-open',
      // icon_description: 'fa-solid fa-calendar-day',
      // background: '#17a2b8',
      title: this.dashboardCards().awaitingFinanceOrders,
      category: 'Editais',
      description: 'Editais em aberto',
    },
    {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: this.dashboardCards().solicitationFinished,
      category: 'Editais',
      description: 'Editais resolvidos',
    },
  ]);

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _tenderService: TenderService,
    private readonly _toastr: ToastrService
  ) { }

  public openTenderFilterDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogFilterTenderComponent, {
        data: {...this.filtersFromDialog.getRawValue()},
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.filters = {
              ...res.filters,
              start_date: res.filters?.start_date ? dayjs(res.filters.start_date).format('YYYY-MM-DD') : '',
              end_date: res.filters?.end_date ? dayjs(res.filters.end_date).format('YYYY-MM-DD') : '',
            };

            !res.clear ? this.filtersFromDialog.patchValue(res.filters) : this.filtersFromDialog.reset();
          }
        }
      })
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
        data: data ? {...data} : null,
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            if(res.id) this.tenderPatch(res.id, res);
            else this.tenderStore(res);
          }
        }
      })
  }

  private tenderStore(tender){
    this._tenderService.postTender(tender)
    .subscribe({
      next: (res) => {
        this._toastr.success('Edital cadastrado com sucesso!');
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    });
  }

  private tenderPatch(id, tender){
    this._tenderService.patchTender(id, tender)
    .subscribe({
      next: (res) => {
        this._toastr.success(res.message);
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    });
  }

}
