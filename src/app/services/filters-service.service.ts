import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private readonly STORAGE_KEY_TENDERS = 'savedFiltersTenders';
  private readonly STORAGE_KEY_SEARCH = 'savedFiltersSearch';

  getFilters(tipo: string) {
    if (tipo == 'Tender') {
      const savedFilters = localStorage.getItem(this.STORAGE_KEY_TENDERS);
      return savedFilters ? JSON.parse(savedFilters) : null;
    }
    else if (tipo == 'Search') {
      const savedFilters = localStorage.getItem(this.STORAGE_KEY_SEARCH);
      return savedFilters ? JSON.parse(savedFilters) : null;
    }
  }

  setFilters(filters, tipo: string): void {
    if (filters) {
      if (tipo == 'Tender') {
        localStorage.setItem(this.STORAGE_KEY_TENDERS, JSON.stringify(filters));
      } else if (tipo == 'Search') {
        localStorage.setItem(this.STORAGE_KEY_SEARCH, JSON.stringify(filters));
      }
    } else {
      if (tipo == 'Tender') {
        localStorage.removeItem(this.STORAGE_KEY_TENDERS);
      } else if (tipo == 'Search') {
        localStorage.removeItem(this.STORAGE_KEY_SEARCH);
      }
    }
  }

}
