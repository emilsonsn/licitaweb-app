import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiResponsePageable, PageControl} from "@models/application";
import {Observable} from "rxjs";
import {Utils} from "@shared/utils";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class ClientLogService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  public getHistoricalClient(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<any>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<any>>(`${environment.api}/client-log/search?${paginate}${filterParams}`);
  }

}
