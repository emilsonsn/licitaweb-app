import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Product, ProductHistorical } from '@models/product';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
      private readonly _http: HttpClient
    ) { }

    public getProducts(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Product>> {
      const paginate = Utils.mountPageControl(pageControl);
      const filterParams = Utils.mountPageControl(filters);

      return this._http.get<ApiResponsePageable<Product>>(`${environment.api}/product/search?${paginate}${filterParams}`);
    }

    public getHistoricalProducts(id?: number, pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<ProductHistorical>> {
      const paginate = Utils.mountPageControl(pageControl);
      const filterParams = Utils.mountPageControl(filters);

      return this._http.get<ApiResponsePageable<ProductHistorical>>(`${environment.api}/product/historical?id=${id}&${paginate}${filterParams}`);
    }

    public postProduct(product): Observable<ApiResponse<Product>> {
      return this._http.post<ApiResponse<Product>>(`${environment.api}/product/create`, product);
    }

    public patchProduct(id: number, product): Observable<ApiResponse<Product>> {
      return this._http.post<ApiResponse<Product>>(`${environment.api}/product/${id}?_method=PATCH`, product);
    }

    public deleteProduct(id: number): Observable<DeleteApiResponse> {
      return this._http.delete<DeleteApiResponse>(`${environment.api}/product/${id}`);
    }

  public deleteItemFile(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/product/attachment/${id}`);
  }
}
