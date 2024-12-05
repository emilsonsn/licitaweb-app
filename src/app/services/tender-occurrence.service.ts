import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, PageControl } from '@models/application';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenderOccurrenceService {

  private sessionEndpoint: string = 'tender-occurrence';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getTenders(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<any>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<any>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public postOccurrence(occurrence: FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/create`, occurrence);
  }

  create(occurrence: FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/create`, occurrence);
  }

  search(): Observable<ApiResponse<any[]>> {
    return this._http.get<ApiResponse<any[]>>(`${environment.api}/${this.sessionEndpoint}/search`);
  }
}
