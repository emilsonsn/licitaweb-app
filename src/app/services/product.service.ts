import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Product } from '@models/product';
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

    public postProduct(product: Product): Observable<ApiResponse<Product>> {
      return this._http.post<ApiResponse<Product>>(`${environment.api}/product/create`, product);
    }

    public patchProduct(id: number, product: Product): Observable<ApiResponse<Product>> {
      return this._http.patch<ApiResponse<Product>>(`${environment.api}/product/${id}`, product);
    }

    public deleteProduct(id: number): Observable<DeleteApiResponse> {
      return this._http.delete<DeleteApiResponse>(`${environment.api}/product/${id}`);
    }
}
