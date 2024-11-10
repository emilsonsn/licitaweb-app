import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl} from '@models/application';
import {environment} from '@env/environment';
import { UserSector } from '@models/user';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  private sessionEndpoint: string = 'tender';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getTenderModality(){
      return this._http.get<ApiResponsePageable<UserSector>>(`${environment.api}/${this.sessionEndpoint}`);
  }
}
