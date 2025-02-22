import {Component} from '@angular/core';
import {Order, PageControl} from "@models/application";
import {TenderTaskService} from "@services/tenderTask.service";
import {FiltersService} from "@services/filters-service.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'proposal_closing_date',
    order: Order.DESC,
  };
  isLoading = true;
  tendersCards: any = [];
  filtrosLocalStorage: any;
  filters: any;

  constructor(
    private readonly _tenderTaskService: TenderTaskService,
    private filtersService: FiltersService
  ) {
    this.getFilters();
  }

  pageEvent($event: any) {
    console.log($event);
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.onSubmit();
  }

  onSubmit(filters = null) {
    this.filters = filters ? filters : this.filtrosLocalStorage;
    this.isLoading = true;
    const container = document.querySelector('.container-cards');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    this._tenderTaskService.searchTenderCard(this.pageControl, this.filters)
      .subscribe(
        {
          next: (res) => {
            if (res && res.data) {
              this.tendersCards = res.data.data || [];

              this.pageControl.page = res.data.current_page;
              this.pageControl.itemCount = res.data.total;
              this.pageControl.pageCount = res.data.last_page;
            } else {
              this.tendersCards = [];
            }
          },
          error: (error) => {
            console.error('Error fetching tenders', error);
            this.tendersCards = [];
          },
          complete: () => {
            this.isLoading = false;
          }
        }
      );
  }


  public getFilters(): void{
    this.filtrosLocalStorage = this.filtersService.getFilters('Search');
    this.onSubmit(this.filtrosLocalStorage);
  }

  onReset($event: any) {
    this.filtersService.setFilters(null, 'Search');
    this.pageControl = {
      take: 10,
      page: 1,
      itemCount: 0,
      pageCount: 0,
      orderField: 'proposal_closing_date',
      order: Order.DESC,
    }
    this.onSubmit();
  }
}
