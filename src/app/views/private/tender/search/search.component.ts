import {Component} from '@angular/core';
import {Order, PageControl} from "@models/application";
import { FiltersService } from '@services/filters-service.service';
import {TenderTaskService} from "@services/tenderTask.service";
import { finalize } from 'rxjs';

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
  isLoading = false;
  tendersCards: any = [];
  loading: boolean = false;
  filtrosLocalStorage;

  constructor(
    private readonly _tenderTaskService: TenderTaskService,
    private filtersService: FiltersService
  ) {
    this.getFilters();
    
  }

  ngOnDestroy(){
    // this.filtersService.setFilters(null, 'Search');
  }

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.onSubmit();
  }

  onSubmit(filters = null) {
    const container = document.querySelector('.container-cards');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    this._tenderTaskService.searchTenderCard(this.pageControl, filters)
    .pipe(finalize(() => this.loading = true))
    .subscribe(
      {
        next: (res) => {
          if (res && res.data) {
            this.loading = false;
            this.tendersCards = res.data.data || [];

            this.pageControl.page = res.data.current_page - 1;
            this.pageControl.itemCount = res.data.total;
            this.pageControl.pageCount = res.data.last_page;

          } else {
            this.tendersCards = [];
          }
        },
        error: (error) => {
          console.error('Error fetching tenders', error);
          this.tendersCards = [];
        }
      }
    );
  }

  public getFilters(): void{
    this.filtrosLocalStorage = this.filtersService.getFilters('Search');
    this.onSubmit(this.filtrosLocalStorage);
  }
}
