import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable } from '@models/application';
import { Utils } from '@shared/utils';
import { ContractProduct } from '@models/contract-product';

@Injectable({
  providedIn: 'root',
})
export class ContractProductService {
  private baseUrl = `${environment.api}/contract-product`;

  constructor(private readonly _http: HttpClient) {}

  search(
    pageControl?: any,
    filters?: any
  ): Observable<ApiResponsePageable<ContractProduct>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<any>>(
      `${this.baseUrl}/search?${paginate}${filterParams}`
    );
  }

  getById(id: number): Observable<ApiResponse<ContractProduct>> {
    return this._http.get<ApiResponse<ContractProduct>>(
      `${this.baseUrl}/${id}`
    );
  }

  create(data: ContractProduct[]): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, data);
  }

  update(id: number, data: ContractProduct): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
