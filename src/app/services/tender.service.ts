import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl} from '@models/application';
import {environment} from '@env/environment';
import { UserSector } from '@models/user';
import { Observable } from 'rxjs';
import { Utils } from '@shared/utils';
import { Tender } from '@models/tender';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  private sessionEndpoint: string = 'tender';

  constructor(
    private readonly _http: HttpClient
  ) { }


  public getTenders(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<Tender>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Tender>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }


  public postTender(tender: FormData): Observable<ApiResponse<Tender>> {
    return this._http.post<ApiResponse<Tender>>(`${environment.api}/${this.sessionEndpoint}/create`, tender);
  }

  public patchTender(id: number, tender: FormData): Observable<ApiResponse<Tender>> {
    return this._http.post<ApiResponse<Tender>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, tender);
  }

  public deleteTender(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public deleteItem(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/item/${id}`);
  }

  public deleteItemAttachment(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/attachment/${id}`);
  }

  getTenderById(tender_id: any): Observable<ApiResponse<Tender>> {
    return this._http.get<ApiResponse<Tender>>(`${environment.api}/${this.sessionEndpoint}/${tender_id}`);
  }
}
