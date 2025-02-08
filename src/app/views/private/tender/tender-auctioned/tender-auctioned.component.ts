import {Component, computed, Signal, signal} from '@angular/core';
import {TenderFilters} from "@models/tenderFilters";
import {OrderData} from "@models/dashboard";
import {ISmallInformationCard} from "@models/cardInformation";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {TenderService} from "@services/tender.service";
import {ToastrService} from "ngx-toastr";
import {TenderTaskService} from "@services/tenderTask.service";
import {FiltersService} from "@services/filters-service.service";
import {TenderOccurrenceService} from "@services/tender-occurrence.service";
import dayjs from "dayjs";
import {DialogNoticesComponent} from "@shared/dialogs/dialog-notices/dialog-notices.component";
import {finalize} from "rxjs";
import {DialogTaskComponent} from "@shared/dialogs/dialog-task/dialog.task.component";
import {DialogOcurrenceComponent} from "@shared/dialogs/dialog-ocurrence/dialog-ocurrence.component";
import {
  DialogFilterTenderAuctionedComponent
} from "@shared/dialogs/filters/dialog-filter-tender-auctioned/dialog-filter-tender-auctioned.component";

@Component({
  selector: 'app-tender-auctioned',
  templateUrl: './tender-auctioned.component.html',
  styleUrl: './tender-auctioned.component.scss'
})
export class TenderAuctionedComponent {
  public loading: boolean = false;
  public filtersFromDialog;
  public filters: TenderFilters;
  public totalValue: number;

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
    private readonly _toastr: ToastrService,
    private readonly _tenderTaskService: TenderTaskService,
    private readonly filtersService: FiltersService,
    private readonly _tenderOccurence: TenderOccurrenceService
  ) {
    this.getFilters();
  }

  ngOnDestroy() {
    this.filtersService.setFilters(null, 'Tender');
  }

  public openTenderFilterDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogFilterTenderAuctionedComponent, {
        data: {...this.filtersFromDialog},
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.filters = {
              ...res.filters,
              start_contest_date: res.filters?.start_contest_date ? dayjs(res.filters.start_contest_date).format('YYYY-MM-DD') : '',
              end_contest_date: res.filters?.end_contest_date ? dayjs(res.filters.end_contest_date).format('YYYY-MM-DD') : '',
            };

            !res.clear ? this.filtersFromDialog = (res.filters) : this.filtersFromDialog = null;
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
        ...dialogConfig,
        data: data ? {...data} : null,
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


  deletetender(id: number) {
    this._initOrStopLoading();
    this._tenderService
      .deleteTender(id)
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

  changeTotalValue(value) {
    this.totalValue = value;
  }

  public openTaskDialog(id) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogTaskComponent, {
        data: {id},
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (task) => {
          if (task) {
            this.createTask(task);
          }
        }
      })
  }


  public openOcurrenceDialog(id) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogOcurrenceComponent, {
        data: {id},
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (occurrence) => {
          // if (occurrence) {
          //   this.createOccurrence(occurrence);
          // }
        }
      })
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  private createTask(task) {
    this._tenderTaskService.create(task)
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.success(err.error.message);
        },
      });
  }

  private createOccurrence(occurrence) {
    this._tenderOccurence.create(occurrence)
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.success(err.error.message);
        },
      });
  }

  private tenderStore(tender) {
    this._initOrStopLoading();
    this._tenderService.postTender(tender)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success('Edital cadastrado com sucesso!');
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  private tenderPatch(id, tender) {
    this._initOrStopLoading();
    this._tenderService.patchTender(id, tender)
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

  public getFilters(): void {
    this.filters = this.filtersService.getFilters('Tender');
  }

}
