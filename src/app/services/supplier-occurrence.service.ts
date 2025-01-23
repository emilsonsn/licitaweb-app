import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, PageControl } from '@models/application';
import { Occurrence } from '@models/Task copy';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierOccurrenceService {
  private sessionEndpoint: string = 'supplier-occurrence';

  constructor(
    private readonly _http: HttpClient
  ) { }

  create(occurrence: FormData): Observable<ApiResponse<Occurrence>> {
    return this._http.post<ApiResponse<Occurrence>>(`${environment.api}/${this.sessionEndpoint}/create`, occurrence);
  }

  search(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Occurrence[]>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Occurrence[]>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }
}
