import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import {CommitmentNote} from "@models/CommitmentNote";

@Injectable({
  providedIn: 'root'
})
export class CommitmentNotesService {
  private readonly baseUrl = `${environment.api}/commitment-note`;

  constructor(private readonly _http: HttpClient) {}

  getAll(): Observable<{ data: CommitmentNote[] }> {
    return this._http.get<{ data: CommitmentNote[] }>(`${this.baseUrl}/all`);
  }

  search(search_term?: string, contract_id?: number, take: number = 10): Observable<any> {
    let params = new HttpParams().set('take', take.toString());
    if (search_term) params = params.set('search_term', search_term);
    if (contract_id) params = params.set('contract_id', contract_id.toString());

    return this._http.get(`${this.baseUrl}/search`, { params });
  }

  create(data: CommitmentNote): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, data);
  }

  update(id: number, data: CommitmentNote): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }

  deleteProduct(commitmentProductId: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/product/${commitmentProductId}`);
  }
}
