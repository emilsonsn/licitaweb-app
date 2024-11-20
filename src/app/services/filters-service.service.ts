import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private readonly STORAGE_KEY = 'savedFilters';

  getFilters(): any {
    const savedFilters = localStorage.getItem(this.STORAGE_KEY);
    return savedFilters ? JSON.parse(savedFilters) : null;
  }

  setFilters(filters: any): void {
    if (filters) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filters));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
