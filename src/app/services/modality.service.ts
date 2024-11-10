import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Modality } from '@models/modality';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalityService {

  private sessionEndpoint: string = 'modality';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getModality(): Observable<ApiResponse<Modality>> {
    return this._http.get<ApiResponse<Modality>>(`${environment.api}/${this.sessionEndpoint}/me`);
  }

  public getModalities(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<Modality>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Modality>>(`${environment.api}/${this.sessionEndpoint}/all?${paginate}${filterParams}`);
  }

  public postModality(modality: Modality): Observable<ApiResponse<Modality>> {
    return this._http.post<ApiResponse<Modality>>(`${environment.api}/${this.sessionEndpoint}/create`, modality);
  }

  public patchModality(id: number, modality: FormData): Observable<ApiResponse<Modality>> {
    return this._http.post<ApiResponse<Modality>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, modality);
  }

  public deleteModality(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }
}
