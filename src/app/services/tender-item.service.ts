import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class TenderItemService {
  private readonly baseUrl = `${environment.api}/tender-item`;

  constructor(private readonly _http: HttpClient) { }

  search(params: any): Observable<any> {
    return this._http.get(`${this.baseUrl}/search`, { params });
  }

  getById(id: number): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  getByTenderId(tenderId: number): Observable<any> {
    return this._http.get(`${this.baseUrl}/tender/${tenderId}`);
  }

  create(data: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
