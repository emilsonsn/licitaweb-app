import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Supplier } from '@models/supplier';
import { SupplierClient } from '@models/supplierClient';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private sessionEndpoint: string = 'supplier';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getSuppliers(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Supplier>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Supplier>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public postSupplier(supplier: SupplierClient): Observable<ApiResponse<Supplier>> {
    return this._http.post<ApiResponse<Supplier>>(`${environment.api}/${this.sessionEndpoint}/create`, supplier);
  }

  public patchSupplier(id: number, supplier: SupplierClient): Observable<ApiResponse<Supplier>> {
    return this._http.patch<ApiResponse<Supplier>>(`${environment.api}/${this.sessionEndpoint}/${id}`, supplier);
  }

  public deleteSupplier(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

}


